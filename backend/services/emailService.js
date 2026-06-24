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

export const sendVerificationEmail = async (user, otp) => {
  await sendEmail({
    email: user.email,
    subject: 'Your Verification Code - E-Shop Online',
    message: `Your verification code is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-top: 0;">Email Verification</h2>
        <p style="color: #475569; font-size: 16px;">Hi ${user.name},</p>
        <p style="color: #475569; font-size: 16px;">Thank you for registering! Please use the following 6-digit OTP to verify your email address:</p>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-radius: 8px; margin: 32px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 14px;">This code will expire in 15 minutes. Do not share this code with anyone.</p>
      </div>
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
