import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogDetail from '../BlogDetail';
import apiService from '../../../services/api';

// Mock the API service
vi.mock('../../../services/api', () => ({
  default: {
    request: vi.fn(),
  },
}));

// Mock the CommentSection component
vi.mock('../CommentSection', () => ({
  default: ({ blogId }) => <div data-testid={`comment-section-${blogId}`}>Comment Section</div>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Clock: () => <div data-testid="clock-icon" />,
  Heart: ({ className }) => <div data-testid="heart-icon" className={className} />,
  Loader2: () => <div data-testid="loader-icon" />,
  Share2: () => <div data-testid="share-icon" />,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(),
  },
});

describe('BlogDetail', () => {
  const mockBlog = {
    _id: 'blog-123',
    title: 'Test Blog Post',
    subheading: 'This is a test blog post',
    content: '<p>This is the blog content</p>',
    headerImage: 'https://example.com/image.jpg',
    tags: ['react', 'javascript'],
    createdAt: '2024-01-15T10:00:00Z',
    author: {
      fullName: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      bio: 'Test author bio'
    },
    metrics: {
      likes: 10,
      comments: 5
    },
    readingTime: '5 min read'
  };

  const mockLikeStatus = {
    data: {
      liked: true,
      likesCount: 10
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders loading state initially', () => {
    apiService.request.mockImplementation(() => new Promise(() => {}));

    render(<BlogDetail slug="test-blog" />);

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByText('Loading blog post...')).toBeInTheDocument();
  });

  it('renders blog content when data is loaded', async () => {
    apiService.request.mockResolvedValueOnce({ data: mockBlog });

    render(<BlogDetail slug="test-blog" />);

    await waitFor(() => {
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      expect(screen.getByText('This is a test blog post')).toBeInTheDocument();
      expect(screen.getByText('This is the blog content')).toBeInTheDocument();
    });

    // Check author information
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test author bio')).toBeInTheDocument();

    // Check tags
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('renders header image when available', async () => {
    apiService.request.mockResolvedValueOnce({ data: mockBlog });

    render(<BlogDetail slug="test-blog" />);

    await waitFor(() => {
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveAttribute('alt', 'Test Blog Post');
    });
  });

  it('handles like functionality for authenticated users', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue('fake-token');

    apiService.request
      .mockResolvedValueOnce({ data: mockBlog })
      .mockResolvedValueOnce(mockLikeStatus)
      .mockResolvedValueOnce({ data: { message: 'Blog liked successfully' } });

    render(<BlogDetail slug="test-blog" />);

    await waitFor(() => {
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    // Click the like button
    const likeButton = screen.getByRole('button', { name: /like/i });
    await user.click(likeButton);

    await waitFor(() => {
      expect(apiService.request).toHaveBeenCalledWith('/blogs/blog-123/likes', {
        method: 'POST',
        headers: expect.any(Object)
      });
    });
  });

  it('handles share functionality', async () => {
    const user = userEvent.setup();
    apiService.request.mockResolvedValueOnce({ data: mockBlog });

    render(<BlogDetail slug="test-blog" />);

    await waitFor(() => {
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    // Click the share button
    const shareButton = screen.getByRole('button', { name: /share/i });
    await user.click(shareButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(screen.getByText('Link copied!')).toBeInTheDocument();
  });

  it('displays reading time and metrics', async () => {
    apiService.request.mockResolvedValueOnce({ data: mockBlog });

    render(<BlogDetail slug="test-blog" />);

    await waitFor(() => {
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // likes count
      expect(screen.getByText('5')).toBeInTheDocument(); // comments count
    });
  });

  it('renders comment section with correct blog ID', async () => {
    apiService.request.mockResolvedValueOnce({ data: mockBlog });

    render(<BlogDetail slug="test-blog" />);

    await waitFor(() => {
      expect(screen.getByTestId('comment-section-blog-123')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    apiService.request.mockRejectedValueOnce(new Error('Blog not found'));

    render(<BlogDetail slug="test-blog" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load blog post')).toBeInTheDocument();
      expect(screen.getByText('Blog not found')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('shows default tags when no tags provided', async () => {
    const blogWithoutTags = { ...mockBlog, tags: [] };
    apiService.request.mockResolvedValueOnce({ data: blogWithoutTags });

    render(<BlogDetail slug="test-blog" />);

    await waitFor(() => {
      expect(screen.getByText('Insight')).toBeInTheDocument();
    });
  });

  it('handles missing slug gracefully', () => {
    render(<BlogDetail slug="" />);

    expect(screen.getByText('Loading blog post...')).toBeInTheDocument();
  });
});
