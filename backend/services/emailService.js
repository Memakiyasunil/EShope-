import sendEmail from '../utils/sendEmail.js';

export const sendWelcomeEmail = async (user) => {
  await sendEmail({
    email: user.email,
    subject: 'Welcome to E-Shop Online',
    message: `Hi ${user.name}, welcome to E-Shop Online!`,
    html: `
      <h2>Welcome to E-Shop Online!</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for registering. Start shopping from thousands of products across multiple vendors.</p>
    `,
  });
};

export const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail({
    email: user.email,
    subject: 'Verify Your Email - E-Shop Online',
    message: `Verify your email: ${verifyUrl}`,
    html: `
      <h2>Email Verification</h2>
      <p>Hi ${user.name},</p>
      <p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>
      <p>Link expires in 24 hours.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail({
    email: user.email,
    subject: 'Password Reset - E-Shop Online',
    message: `Reset your password: ${resetUrl}`,
    html: `
      <h2>Password Reset</h2>
      <p>Hi ${user.name},</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 10 minutes.</p>
    `,
  });
};

export const sendOrderConfirmationEmail = async (user, order) => {
  await sendEmail({
    email: user.email,
    subject: `Order Confirmed - ${order.orderNumber}`,
    message: `Your order ${order.orderNumber} has been placed successfully.`,
    html: `
      <h2>Order Confirmed</h2>
      <p>Hi ${user.name},</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been placed successfully.</p>
      <p>Total: ₹${order.totalPrice}</p>
      <p>Status: ${order.status}</p>
    `,
  });
};

export const sendOrderStatusEmail = async (user, order) => {
  await sendEmail({
    email: user.email,
    subject: `Order Update - ${order.orderNumber}`,
    message: `Your order ${order.orderNumber} status: ${order.status}`,
    html: `
      <h2>Order Status Update</h2>
      <p>Hi ${user.name},</p>
      <p>Your order <strong>${order.orderNumber}</strong> is now <strong>${order.status}</strong>.</p>
    `,
  });
};

export const sendSellerApprovalEmail = async (user, seller, approved) => {
  await sendEmail({
    email: user.email,
    subject: approved ? 'Seller Account Approved' : 'Seller Account Update',
    message: approved
      ? `Your seller account "${seller.shopName}" has been approved.`
      : `Your seller application for "${seller.shopName}" was not approved.`,
    html: approved
      ? `<h2>Congratulations!</h2><p>Your shop "${seller.shopName}" is now live on E-Shop Online.</p>`
      : `<h2>Application Update</h2><p>Your seller application was not approved. Reason: ${seller.rejectionReason || 'N/A'}</p>`,
  });
};
