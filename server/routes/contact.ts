import { RequestHandler } from "express";
import { ContactFormData, ContactFormResponse } from "../../shared/api";

export const handleContact: RequestHandler = async (req, res) => {
  try {
    const { name, email, message } = req.body as ContactFormData;

    // Basic validation
    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      } as ContactFormResponse);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email address",
      } as ContactFormResponse);
      return;
    }

    // TODO: In a production environment, you would:
    // 1. Send an email via a service like SendGrid, Mailgun, or nodemailer
    // 2. Store the submission in a database
    // 3. Create a notification system
    // For now, this is a placeholder that simulates success

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Contact form submission:", { name, email, message });

    res.json({
      success: true,
      message: "Thank you for your message. We'll be in touch soon!",
    } as ContactFormResponse);
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    } as ContactFormResponse);
  }
};
