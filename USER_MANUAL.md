# Daily Expenses Manager - User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles](#user-roles)
4. [Features Overview](#features-overview)
5. [User Guide](#user-guide)
6. [Admin Guide](#admin-guide)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## Introduction

### What is Daily Expenses Manager?

Daily Expenses Manager is a comprehensive web-based financial management application designed to help individuals and families track their income, expenses, and overall financial health. The application provides powerful tools for managing multiple accounts, categorizing transactions, and visualizing financial data through interactive dashboards.

### Key Features

- **Multi-Account Management**: Track multiple bank accounts, cash, and credit cards
- **Transaction Tracking**: Record income, expenses, transfers, borrowings, and repayments
- **Financial Dashboard**: Visual overview of your financial status with charts and summaries
- **Expense Categorization**: Organize expenses by nature (Fixed, Variable, Unwanted, Others, Baby Needs)
- **Filtering & Reporting**: Advanced filtering by date range, source, and nature
- **User Management**: Admin controls for managing multiple users
- **Secure Authentication**: Password-protected accounts with session management

---

## Getting Started

### System Requirements

- **Web Browser**: Modern web browser (Chrome, Firefox, Safari, Edge)
- **Internet Connection**: Required for accessing the application
- **JavaScript**: Must be enabled in your browser

### First-Time Setup

#### 1. Registration

1. Navigate to the application URL
2. Click on **"Register"** or **"Sign Up"**
3. Fill in the registration form:
   - **Username**: Your display name
   - **Email**: Valid email address (used for login)
   - **Password**: Secure password (minimum requirements apply)
4. Click **"Register"** to create your account
5. You will be automatically logged in after successful registration

#### 2. Initial Login

1. Go to the login page
2. Enter your **email** and **password**
3. Click **"Login"**
4. You will be redirected to your dashboard

> **Default Admin Account**:
> - Email: `admin@admin.com`
> - Password: `admin@123`
> - **Important**: Change this password immediately after first login!

---

## User Roles

### Regular User

Regular users can:
- View their personal dashboard
- Add, edit, and delete transactions
- Manage their accounts (sources)
- Filter and view transaction history
- Track income, expenses, and balances

### Administrator

Administrators have all user privileges plus:
- Access to admin dashboard
- View all users in the system
- Add new admin users
- Manage system-wide settings
- View aggregated financial data

---

## Features Overview

### Dashboard

The dashboard is your financial command center, displaying:

- **Summary Cards**:
  - Total Income (green)
  - Total Expense (red)
  - Outstanding Debt (orange)
  - Total Balance (blue)

- **Account Balances**: List of all your accounts with current balances
- **Recent Transactions**: Latest financial activities with filtering options
- **Financial Overview Chart**: Visual representation of income vs. expenses

### Transaction Types

1. **Income**: Money received (salary, gifts, refunds, etc.)
2. **Expense**: Money spent (bills, shopping, entertainment, etc.)
3. **Transfer**: Moving money between your accounts
4. **Borrow**: Money borrowed from someone
5. **Repayment**: Paying back borrowed money

### Account Types (Sources)

1. **Bank Account**: Traditional bank accounts
2. **Cash**: Physical cash on hand
3. **Credit Card**: Credit card accounts with credit limits

---

## User Guide

### Managing Accounts (Sources)

#### Adding a New Account

1. From the dashboard, click **"Add Account"** or navigate to **Sources → Add**
2. Fill in the account details:
   - **Name**: Account identifier (e.g., "HDFC Savings", "Wallet Cash")
   - **Type**: Select Bank, Cash, or Credit Card
   - **Initial Balance**: Starting balance
   - **Credit Limit** (for credit cards only): Maximum credit available
3. Click **"Add Source"** to save

#### Viewing All Accounts

1. Navigate to **"Manage Accounts"** or **Sources**
2. View list of all accounts with:
   - Account name and type
   - Current balance
   - Credit limit (for credit cards)
   - Action buttons (Edit/Delete)

#### Editing an Account

1. Go to **Sources** page
2. Click the **Edit** button (pencil icon) next to the account
3. Modify the details
4. Click **"Update Source"** to save changes

#### Deleting an Account

1. Go to **Sources** page
2. Click the **Delete** button (trash icon) next to the account
3. Confirm the deletion
4. **Warning**: This action cannot be undone!

### Managing Transactions

#### Adding a Transaction

1. Click **"Add Transaction"** from the dashboard or navigate to **Transactions → Add**
2. Select **Transaction Type**:

**For Income:**
- **Amount**: Income amount
- **Date**: Transaction date
- **Category**: Income source (Salary, Gift, Refund, etc.)
- **Description**: Optional notes
- **Account**: Which account received the money

**For Expense:**
- **Amount**: Expense amount
- **Date**: Transaction date
- **Category**: Expense type (Food, Transport, Bills, etc.)
- **Description**: Optional notes
- **Account**: Which account paid from
- **Nature**: Classification
  - Fixed: Regular recurring expenses (rent, subscriptions)
  - Variable: Fluctuating expenses (groceries, utilities)
  - Unwanted: Unnecessary spending
  - Others: Miscellaneous
  - Baby Needs: Child-related expenses

**For Transfer:**
- **Amount**: Transfer amount
- **Date**: Transaction date
- **From Account**: Source account
- **To Account**: Destination account
- **Transfer Fee**: Optional fee charged
- **Description**: Optional notes

**For Borrow:**
- **Amount**: Borrowed amount
- **Date**: Borrow date
- **Lender**: Person/institution you borrowed from
- **Due Date**: Repayment deadline
- **Account**: Account where money was deposited
- **Description**: Optional notes

**For Repayment:**
- **Amount**: Repayment amount
- **Date**: Repayment date
- **Lender**: Person/institution you're repaying
- **Account**: Account used for repayment
- **Description**: Optional notes

3. Click **"Add Transaction"** to save

#### Viewing Transaction History

1. Navigate to **"View Detailed History"** or **Transactions**
2. View complete transaction history with:
   - Transaction type and category
   - Amount (color-coded: green for income, red for expense)
   - Date
   - Account information
   - Description
   - Edit/Delete options

#### Filtering Transactions

On the dashboard or transaction history page:

1. **By Date Range**:
   - Select **Start Date** and **End Date**
   - Transactions will filter automatically

2. **By Source**:
   - Select an account from the **Source** dropdown
   - View transactions for that specific account

3. **By Nature** (for expenses):
   - Select from: Fixed, Variable, Unwanted, Others, Baby Needs
   - View expenses of that classification

4. **Filtered Summary**:
   - View filtered income and expense totals
   - Helps analyze spending patterns

#### Editing a Transaction

1. Find the transaction in your history
2. Click the **Edit** button (pencil icon)
3. Modify the transaction details
4. Click **"Update Transaction"** to save changes

#### Deleting a Transaction

1. Find the transaction in your history
2. Click the **Delete** button (trash icon)
3. Confirm the deletion
4. **Note**: Account balances will be automatically adjusted

### Understanding Your Dashboard

#### Summary Cards

- **Total Income**: Sum of all income and borrowed amounts
- **Total Expense**: Sum of all expenses and repayments
- **Outstanding Debt**: Total amount still owed (borrows minus repayments)
- **Total Balance**: Combined balance across all accounts

#### Account Balances Section

- Lists all your accounts with current balances
- Credit cards show:
  - Current balance (negative if you owe money)
  - Available credit
  - Credit limit

#### Recent Transactions Section

- Shows latest transactions
- Includes filtering controls
- Displays filtered income and expense totals
- Quick access to edit/delete transactions

#### Financial Overview Chart

- Bar chart comparing Income, Expense, and Balance
- Visual representation of financial health
- Updates based on your transaction data

---

## Admin Guide

### Accessing Admin Features

1. Log in with an admin account
2. Navigate to **Admin** section from the menu
3. Access admin dashboard and user management

### Admin Dashboard

The admin dashboard displays:
- Total number of users in the system
- System-wide statistics
- Quick access to user management

### Managing Users

#### Viewing All Users

1. Go to **Admin → Dashboard**
2. View list of all registered users with:
   - Username
   - Email
   - Role (User/Admin)
   - Status (Active/Inactive)

#### Adding a New Admin

1. Navigate to **Admin → Add Admin**
2. Fill in the form:
   - **Username**: Admin's display name
   - **Email**: Admin's email address
   - **Password**: Secure password
3. Click **"Add Admin"** to create the account
4. New admin will have full administrative privileges

### Best Practices for Admins

- **Regular Backups**: Ensure database backups are performed regularly
- **User Monitoring**: Periodically review user accounts for inactive users
- **Security**: Change default admin password immediately
- **Access Control**: Only grant admin privileges to trusted individuals

---

## Troubleshooting

### Common Issues

#### Cannot Log In

**Problem**: Login fails with correct credentials

**Solutions**:
1. Verify email and password are correct
2. Check if Caps Lock is on
3. Clear browser cache and cookies
4. Try a different browser
5. Contact admin if account is locked

#### Transactions Not Showing

**Problem**: Added transactions don't appear

**Solutions**:
1. Check if filters are applied (date range, source, nature)
2. Clear all filters and try again
3. Refresh the page
4. Verify transaction was successfully saved

#### Incorrect Balance

**Problem**: Account balance doesn't match expectations

**Solutions**:
1. Review all transactions for that account
2. Check for duplicate transactions
3. Verify transfer transactions are correctly recorded
4. Ensure all transactions are assigned to correct accounts

#### Chart Not Loading

**Problem**: Financial overview chart doesn't display

**Solutions**:
1. Ensure JavaScript is enabled
2. Check internet connection
3. Refresh the page
4. Try a different browser
5. Clear browser cache

### Error Messages

#### "Session Expired"

- **Cause**: Your login session has timed out
- **Solution**: Log in again

#### "Unauthorized Access"

- **Cause**: Attempting to access admin features without admin privileges
- **Solution**: Log in with an admin account

#### "Invalid Input"

- **Cause**: Form validation failed
- **Solution**: Check all required fields are filled correctly

---

## FAQ

### General Questions

**Q: Is my financial data secure?**

A: Yes, the application uses session-based authentication and password hashing. However, always use strong passwords and log out when finished.

**Q: Can I access the app from multiple devices?**

A: Yes, you can log in from any device with a web browser and internet connection.

**Q: How often should I update my transactions?**

A: For best results, update transactions daily or as they occur to maintain accurate financial records.

### Account Management

**Q: Can I have multiple accounts of the same type?**

A: Yes, you can create multiple bank accounts, cash accounts, or credit cards.

**Q: What happens if I delete an account with transactions?**

A: Deleting an account may affect related transactions. It's recommended to transfer or delete associated transactions first.

**Q: How do credit card limits work?**

A: Credit cards can have negative balances (money owed). The available credit is calculated as: Credit Limit + Current Balance.

### Transaction Questions

**Q: Can I edit or delete old transactions?**

A: Yes, you can edit or delete any transaction at any time. Account balances will automatically adjust.

**Q: What's the difference between Borrow and Expense?**

A: Borrow tracks money you owe to others (debt), while Expense is money spent that you don't need to repay.

**Q: How do transfers work?**

A: Transfers move money between your accounts. The amount is deducted from the source account and added to the destination account.

**Q: Can I categorize my expenses?**

A: Yes, you can assign categories (Food, Transport, etc.) and nature (Fixed, Variable, etc.) to expenses for better organization.

### Reporting & Analysis

**Q: How do I see my spending by category?**

A: Use the filtering options on the dashboard to filter by nature or view the transaction history for detailed breakdowns.

**Q: Can I export my transaction data?**

A: Currently, export functionality is not built-in. Contact your administrator for database export options.

**Q: What's the best way to track monthly expenses?**

A: Use the date range filter to select a specific month and review the filtered totals.

### Admin Questions

**Q: How do I reset a user's password?**

A: Currently, password reset must be done directly in the database. This feature may be added in future updates.

**Q: Can I deactivate a user account?**

A: User deactivation features are available through the user status field in the database.

**Q: How many admin accounts should I create?**

A: Create only as many admin accounts as necessary. Each admin has full system access.

---

## Tips for Effective Financial Management

### Daily Habits

1. **Record Immediately**: Add transactions as they happen
2. **Review Daily**: Check your dashboard each day
3. **Categorize Properly**: Use consistent categories for better analysis

### Weekly Practices

1. **Review Spending**: Analyze your expense patterns
2. **Check Balances**: Verify account balances match reality
3. **Plan Ahead**: Review upcoming expenses and due dates

### Monthly Routines

1. **Generate Reports**: Use date filters to review monthly spending
2. **Analyze Trends**: Compare income vs. expenses
3. **Adjust Budget**: Identify areas to reduce unwanted spending
4. **Review Debts**: Check outstanding borrowings and plan repayments

### Best Practices

- **Use Descriptive Names**: Give accounts and transactions clear, meaningful names
- **Add Descriptions**: Include notes for future reference
- **Regular Backups**: Admins should ensure regular database backups
- **Security First**: Always log out when finished, especially on shared devices
- **Consistent Categories**: Use the same categories for similar transactions

---

## Support & Contact

For technical support or feature requests, please contact your system administrator.

### Version Information

- **Application**: Daily Expenses Manager
- **Version**: 1.0.0
- **Last Updated**: January 2026

---

## Appendix

### Keyboard Shortcuts

- **Ctrl + S**: Save form (when in input fields)
- **Esc**: Close modals/dialogs
- **Tab**: Navigate between form fields

### Transaction Category Suggestions

**Income Categories**:
- Salary
- Freelance
- Investment Returns
- Gifts
- Refunds
- Other Income

**Expense Categories**:
- Food & Dining
- Transportation
- Utilities
- Rent/Mortgage
- Healthcare
- Entertainment
- Shopping
- Education
- Insurance
- Baby Needs
- Other Expenses

### Glossary

- **Source**: An account where money is stored (bank, cash, credit card)
- **Transaction**: Any financial activity (income, expense, transfer, etc.)
- **Nature**: Classification of expenses (Fixed, Variable, Unwanted, etc.)
- **Balance**: Current amount of money in an account
- **Credit Limit**: Maximum amount you can borrow on a credit card
- **Outstanding Debt**: Total amount of money you owe to others

---

**End of User Manual**

*For the latest updates and documentation, please check with your system administrator.*
