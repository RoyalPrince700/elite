# Payment Workflow Documentation

## Overview

This document outlines the complete payment workflow for the EliteRetoucher application, from user subscription request to final payment confirmation and subscription activation.

## ✅ **Current Implementation Status**
- ✅ User subscription requests with plan selection
- ✅ Admin review and approval workflow
- ✅ Invoice creation with comprehensive payment details
- ✅ User payment completion and status updates
- ✅ Admin payment confirmation and subscription activation
- ✅ Complete status flow tracking with timestamps
- ✅ Real-time dashboard updates for both users and admins
- ✅ Modal-based invoice creation with bank details
- ✅ Payment link integration and additional instructions
- ✅ Multi-status invoice management (sent → payment_made → payment_confirmed → paid)

## 🚀 **Key Features Implemented**

### **Admin Features**
- **Invoice Creation Modal**: Complete payment details form with bank information
- **Payment Confirmation**: One-click payment approval with subscription activation
- **Invoice Management**: Dedicated tab for tracking all invoice statuses
- **Real-time Updates**: Live status changes and notifications

### **User Features**
- **Payment Details Modal**: Complete payment information display
- **Status Updates**: Mark payments as completed with instant feedback
- **Awaiting Confirmation**: Clear status indicators during admin review
- **Payment Instructions**: Detailed payment guidance and clickable links

### **Technical Features**
- **String-based Plan IDs**: Frontend-backend plan ID synchronization
- **Comprehensive Status Tracking**: Multi-stage status flow with timestamps
- **Error Handling**: Detailed logging and user-friendly error messages
- **Database Optimization**: Efficient queries with proper indexing
- **API Documentation**: Complete endpoint documentation with examples

## 🎯 **Complete Payment Flow**

### **Phase 1: User Subscription Request**

#### **Step 1.1: Browse Pricing Plans**
- User navigates to `/pricing` page
- Views available subscription plans (Silver, Gold, Diamond)
- Can switch between Monthly/Annual billing cycles

#### **Step 1.2: Select a Plan**
- User clicks "Get Started" button on desired plan
- **Authentication Check**: Must be logged in to proceed
- If not authenticated, redirected to login with info toast

#### **Step 1.3: Fill Subscription Form**
- Modal form opens with plan details
- **Required Information**:
  - Company Name
  - Contact Person
  - Phone Number
  - Email Address
  - Billing Address (Street, City, State, ZIP, Country)
  - Tax ID (Optional)
  - Special Instructions (Optional)
- **Billing Cycle Selection**: Monthly or Annual
- Form auto-populates with user's existing information

#### **Step 1.4: Submit Request**
- Form data sent to backend via `POST /api/subscriptions/request`
- Creates `SubscriptionRequest` document with status: `'pending'`
- Success toast: "Subscription request submitted successfully! You will receive an invoice soon."
- Form closes and user redirected to dashboard

---

### **Phase 2: Admin Review Process**

#### **Step 2.1: Admin Dashboard Access**
- Admin navigates to `/admin` (requires `role: 'admin'`)
- Dashboard shows statistics cards and tabbed interface
- **Tabs Available**: Users, Subscription Requests, Invoices, Payment Receipts

#### **Step 2.2: Review Subscription Requests**
- Click "Subscription Requests" tab
- View all pending requests in card format
- **Request Information Displayed**:
  - Company and contact details
  - Selected plan and billing cycle
  - Special instructions
  - Submission date
  - Current status badge

#### **Step 2.3: Process Request**
- **Approve Request**: Changes status to `'approved'`
- **Reject Request**: Changes status to `'rejected'`
- **Send Invoice**: For approved requests, changes status to `'invoice_sent'`
- All actions update the request with admin notes and timestamps

---

### **Phase 3: Invoice Generation with Payment Details**

#### **Step 3.1: Create Invoice with Payment Details**
- Admin clicks "Send Invoice" on approved request
- **Invoice Modal Opens** with comprehensive payment form:
  - **Due Date**: Auto-set to 30 days from creation
  - **Bank Details**: Account number, account name, bank name
  - **Payment Link**: Optional external payment URL
  - **Additional Instructions**: Custom payment guidance
  - **Notes**: Internal admin notes
  - **Payment Instructions**: User-facing payment guidance

#### **Step 3.2: Invoice Storage**
- Creates `Invoice` document with:
  - Unique invoice number (format: `INV-YYYYMMDD-RANDOM`)
  - Status: `'sent'`
  - **Payment Details Object**:
    ```javascript
    {
      accountNumber: "0311221122",
      accountName: "joseph adesunkanmi",
      bankName: "gtb",
      paymentLink: "https://...",
      additionalInstructions: "..."
    }
    ```
  - Links to subscription request and plan
  - Payment due date

#### **Step 3.3: User Dashboard Integration**
- Invoice appears on user's dashboard with "View Details" button
- **Invoice Modal** shows complete payment information:
  - Amount and due date
  - Bank account details
  - Payment links (clickable)
  - Payment instructions
  - Status tracking

---

### **Phase 4: User Payment Completion**

#### **Step 4.1: User Dashboard View**
- User sees invoice in "Subscription & Billing" section
- Invoice shows amount, due date, and status
- **"View Details" Button**: Shows complete payment information
- **"Mark as Paid" Button**: Available when status is `'sent'`

#### **Step 4.2: User Marks Payment as Completed**
- User clicks "Mark as Paid" button after making payment
- **Status Update**: Invoice status changes to `'payment_made'`
- **User Feedback**: "Payment marked as completed! Awaiting admin confirmation."
- **Visual Status**: Shows "Awaiting Confirmation" badge
- **Timestamp**: `paymentMadeAt` field updated

#### **Step 4.3: Admin Notification**
- Admin sees invoice with `'payment_made'` status
- **"Confirm Payment" Button**: Available for admin approval
- Admin can review payment details before confirming

---

### **Phase 5: Admin Payment Confirmation**

#### **Step 5.1: Review Pending Payments**
- Admin navigates to "Invoices" tab in admin dashboard
- Views all invoices with `'payment_made'` status
- **Invoice Information**:
  - User details and contact information
  - Invoice amount and due date
  - Payment details (account info, bank details)
  - `paymentMadeAt` timestamp
  - User notes and payment instructions

#### **Step 5.2: Confirm Payment**
- Admin reviews payment details and user information
- **"Confirm Payment" Button**: Updates invoice status to `'payment_confirmed'`
- **Timestamp Update**: `paymentConfirmedAt` field set
- **Success Feedback**: "Payment confirmed successfully!"
- Admin can add internal notes if needed

#### **Step 5.3: Subscription Activation**
- **Upon Confirmation**:
  - Invoice status updated to `'paid'`
  - Subscription request status updated to `'completed'`
  - **Subscription Created** with:
    - User ID from invoice
    - Plan from subscription request
    - Start date: Current date
    - End date: Based on billing cycle (30 days for monthly)
    - Status: `'active'`
    - Image limits based on plan

---

### **Phase 6: Subscription Activation**

#### **Step 6.1: User Dashboard Update**
- User sees active subscription in dashboard
- Subscription details displayed:
  - Plan name and price
  - Image usage tracking
  - Next billing date
  - Subscription status

#### **Step 6.2: Complete Workflow**
- User can now access full platform features
- Subscription appears in user's profile
- Admin can monitor subscription analytics

---

## 🔧 **Technical Implementation**

### **Database Models**

#### **SubscriptionRequest**
```javascript
{
  userId: ObjectId,
  planId: String, // Changed to String for plan IDs
  billingCycle: 'monthly' | 'quarterly' | 'yearly',
  status: 'pending' | 'approved' | 'rejected' | 'invoice_sent' | 'completed',
  companyName: String,
  contactPerson: String,
  phone: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  taxId: String,
  specialInstructions: String,
  calculatedPrice: Number,
  finalPrice: Number,
  reviewedBy: ObjectId,
  reviewedAt: Date
}
```

#### **Invoice**
```javascript
{
  invoiceNumber: String (unique),
  userId: ObjectId,
  subscriptionRequestId: ObjectId,
  planId: String, // Changed to String for plan IDs
  billingCycle: String,
  amount: Number,
  currency: 'USD',
  dueDate: Date,
  status: 'sent' | 'viewed' | 'payment_made' | 'payment_confirmed' | 'paid' | 'overdue' | 'cancelled',
  sentAt: Date,
  viewedAt: Date,
  paymentMadeAt: Date,      // NEW: When user marks as paid
  paymentConfirmedAt: Date, // NEW: When admin confirms
  paidAt: Date,
  paymentDetails: {         // NEW: Complete payment information
    accountNumber: String,
    accountName: String,
    bankName: String,
    paymentLink: String,
    additionalInstructions: String
  },
  invoiceItems: Array,
  notes: String,
  paymentInstructions: String,
  createdBy: ObjectId
}
```

#### **PaymentReceipt**
```javascript
{
  userId: ObjectId,
  invoiceId: ObjectId,
  subscriptionRequestId: ObjectId,
  amount: Number,
  currency: 'USD',
  paymentMethod: 'bank_transfer' | 'cash' | 'check' | 'other',
  transactionReference: String,
  paymentDate: Date,
  receiptUrl: String,
  cloudinaryPublicId: String,
  fileName: String,
  fileSize: Number,
  notes: String,
  status: 'submitted' | 'approved' | 'rejected',
  adminNotes: String,
  reviewedBy: ObjectId,
  reviewedAt: Date,
  subscriptionId: ObjectId
}
```

#### **Subscription**
```javascript
{
  userId: ObjectId,
  planId: String, // Changed to String for plan IDs
  startDate: Date,
  endDate: Date,
  status: 'active' | 'inactive' | 'cancelled' | 'expired',
  imagesUsed: Number,
  imagesLimit: Number,
  monthlyPrice: Number,
  billingCycle: String,
  nextBillingDate: Date
}
```

### **API Endpoints**

#### **User Endpoints**
- `POST /api/subscriptions/request` - Create subscription request
- `GET /api/subscriptions/requests` - Get user's requests
- `GET /api/subscriptions/invoices` - Get user's invoices
- `PUT /api/subscriptions/invoices/:id/status` - Update invoice status (mark as paid)
- `POST /api/subscriptions/payments/receipt` - Submit payment receipt

#### **Admin Endpoints**
- `GET /api/admin/subscription-requests` - Get all requests
- `PUT /api/admin/subscription-requests/:id` - Update request status
- `POST /api/admin/invoices` - Create invoice with payment details
- `PUT /api/admin/invoices/:id/confirm-payment` - Confirm payment and activate subscription
- `GET /api/admin/invoices` - Get all invoices
- `GET /api/admin/invoices/:id` - Get single invoice
- `PUT /api/admin/invoices/:id/status` - Update invoice status
- `GET /api/admin/payment-receipts` - Get all receipts
- `PUT /api/admin/payment-receipts/:id` - Process payment

---

## 🎯 **Status Flow Diagram**

```
User Request → Admin Review → Invoice Sent → Payment Made → Payment Confirmed → Subscription Active
     ↓             ↓             ↓             ↓                 ↓               ↓
  'pending'    'approved'    'invoice_sent'  'payment_made'  'payment_confirmed'  'active'
```

### **Invoice Status Flow**
```
Invoice Sent → Payment Made → Payment Confirmed → Paid
     ↓             ↓                 ↓              ↓
  'sent'      'payment_made'   'payment_confirmed'  'paid'
```

### **Subscription Request Status Flow**
```
Pending → Approved → Invoice Sent → Completed
   ↓         ↓           ↓           ↓
'pending'  'approved'  'invoice_sent'  'completed'
```

---

## 🚨 **Error Handling**

- **Authentication Required**: All payment actions require user login
- **Admin Access**: Admin routes protected by role middleware
- **Form Validation**: Client and server-side validation
- **Database Errors**: Comprehensive error logging
- **Toast Notifications**: User feedback for all actions
- **Graceful Fallbacks**: Error states don't break the UI

---

## 📊 **Monitoring & Analytics**

### **Admin Dashboard Statistics**
- **Users Tab**: Total users, user roles, registration trends
- **Subscription Requests Tab**: Pending/approved/rejected counts, request trends
- **Invoices Tab**: Invoice status breakdown (sent/payment_made/payment_confirmed/paid)
- **Payment Receipts Tab**: Payment processing status
- Real-time status counts and analytics

### **User Dashboard**
- **Subscription Status**: Active subscription details and usage tracking
- **Invoice Management**:
  - Invoice history with detailed payment information
  - "View Details" modal with complete payment instructions
  - "Mark as Paid" functionality with status updates
  - Real-time status tracking (Awaiting Confirmation, Payment Confirmed)
- Payment receipt submissions and history

---

## 🔒 **Security Considerations**

- **Role-based Access Control**: Admin-only routes protected
- **Input Validation**: All form data validated server-side
- **CSRF Protection**: Token-based authentication
- **Data Encryption**: Sensitive payment data handled securely
- **Audit Trail**: All admin actions logged with timestamps

---

## 🚀 **Future Enhancements**

- **Payment Gateway Integration**: Stripe/PayPal integration
- **Automated Email Notifications**: Invoice and payment confirmations
- **Recurring Billing**: Automatic subscription renewals
- **Advanced Analytics**: Revenue tracking and user behavior
- **Multi-currency Support**: International payment processing
- **Invoice PDF Generation**: Downloadable invoice documents

---

## 📞 **Support & Troubleshooting**

### **Common Issues**
- **Subscription Request Fails**: Check if plan IDs are correctly configured
- **Invoice Creation Error**: Verify admin has proper permissions and all required fields
- **Payment Status Not Updating**: Check user authentication and invoice status
- **Admin Cannot Confirm Payment**: Verify admin role and invoice exists
- **Plan Not Found Error**: Ensure subscription plans are seeded correctly

### **Debug Steps**
1. **Browser Console**: Check for API errors and response details
2. **User Authentication**: Verify JWT token and user permissions
3. **Admin Permissions**: Confirm user has `role: 'admin'`
4. **Database Documents**: Check MongoDB for correct document creation
5. **Server Logs**: Review backend logs for detailed error messages
6. **Network Tab**: Verify API requests and responses
7. **Plan IDs**: Ensure frontend plan IDs match database plan IDs
8. **Status Flow**: Check invoice and subscription request status progression

---

*This documentation covers the complete payment workflow implementation. For technical implementation details, refer to the source code and API documentation.*
