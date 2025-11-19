import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import BlogList from '../BlogList';
import apiService from '../../../services/api';

// Mock the API service
vi.mock('../../../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Clock: () => <div data-testid="clock-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Tag: () => <div data-testid="tag-icon" />,
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('BlogList', () => {
  const mockBlogs = [
    {
      id: '1',
      title: 'Test Blog Post 1',
      subheading: 'This is a test blog post',
      headerImage: 'https://example.com/image1.jpg',
      tags: ['react', 'javascript'],
      createdAt: '2024-01-15T10:00:00Z',
      metrics: {
        likes: 10,
        comments: 5
      },
      readingTime: '5 min read'
    },
    {
      id: '2',
      title: 'Test Blog Post 2',
      subheading: 'Another test blog post',
      headerImage: 'https://example.com/image2.jpg',
      tags: ['vue', 'typescript'],
      createdAt: '2024-01-10T10:00:00Z',
      metrics: {
        likes: 8,
        comments: 3
      },
      readingTime: '3 min read'
    }
  ];

  const mockPagination = {
    page: 1,
    limit: 6,
    total: 15,
    totalPages: 3
  };

  const mockFilters = {
    availableTags: ['react', 'javascript', 'vue', 'typescript']
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Mock API to never resolve (loading state)
    apiService.get.mockImplementation(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <BlogList />
      </TestWrapper>
    );

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByText('Loading blogs...')).toBeInTheDocument();
  });

  it('renders blog posts when data is loaded', async () => {
    apiService.get.mockResolvedValueOnce({
      data: mockBlogs,
      pagination: mockPagination,
      filters: mockFilters
    });

    render(
      <TestWrapper>
        <BlogList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Blog Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Blog Post 2')).toBeInTheDocument();
    });

    // Check if blog content is rendered
    expect(screen.getByText('This is a test blog post')).toBeInTheDocument();
    expect(screen.getByText('Another test blog post')).toBeInTheDocument();

    // Check if tags are rendered
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('renders blog cards with images', async () => {
    apiService.get.mockResolvedValueOnce({
      data: mockBlogs,
      pagination: mockPagination,
      filters: mockFilters
    });

    render(
      <TestWrapper>
        <BlogList />
      </TestWrapper>
    );

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
      expect(images[0]).toHaveAttribute('alt', 'Test Blog Post 1');
    });
  });

  it('displays reading time and metrics', async () => {
    apiService.get.mockResolvedValueOnce({
      data: mockBlogs,
      pagination: mockPagination,
      filters: mockFilters
    });

    render(
      <TestWrapper>
        <BlogList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      expect(screen.getByText('3 min read')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    const user = userEvent.setup();

    apiService.get
      .mockResolvedValueOnce({
        data: mockBlogs,
        pagination: mockPagination,
        filters: mockFilters
      })
      .mockResolvedValueOnce({
        data: [mockBlogs[0]], // Filtered result
        pagination: { ...mockPagination, total: 1, totalPages: 1 },
        filters: mockFilters
      });

    render(
      <TestWrapper>
        <BlogList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Blog Post 1')).toBeInTheDocument();
    });

    // Find and interact with search input
    const searchInput = screen.getByPlaceholderText(/search blogs/i);
    await user.type(searchInput, 'React');

    // Wait for API call
    await waitFor(() => {
      expect(apiService.get).toHaveBeenCalledWith('/blogs', {
        params: expect.objectContaining({ search: 'React' })
      });
    });
  });

  it('handles tag filtering', async () => {
    const user = userEvent.setup();

    apiService.get
      .mockResolvedValueOnce({
        data: mockBlogs,
        pagination: mockPagination,
        filters: mockFilters
      })
      .mockResolvedValueOnce({
        data: [mockBlogs[0]], // Filtered result
        pagination: { ...mockPagination, total: 1, totalPages: 1 },
        filters: mockFilters
      });

    render(
      <TestWrapper>
        <BlogList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    // Click on a tag filter
    const reactTag = screen.getByText('react');
    await user.click(reactTag);

    await waitFor(() => {
      expect(apiService.get).toHaveBeenCalledWith('/blogs', {
        params: expect.objectContaining({ tags: 'react' })
      });
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    apiService.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <TestWrapper>
        <BlogList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load blogs. Please try again.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('renders empty state when no blogs found', async () => {
    apiService.get.mockResolvedValueOnce({
      data: [],
      pagination: { ...mockPagination, total: 0, totalPages: 0 },
      filters: { availableTags: [] }
    });

    render(
      <TestWrapper>
        <BlogList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No blogs found.')).toBeInTheDocument();
    });
  });
});
