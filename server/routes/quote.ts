import { RequestHandler } from "express";
import { QuoteFormData, QuoteFormResponse } from "@shared/api";

export const handleQuote: RequestHandler = async (req, res) => {
  try {
    const { name, email, serviceType, description, budgetRange } =
      req.body as QuoteFormData;

    if (!name || !email || !serviceType || !description || !budgetRange) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      } as QuoteFormResponse);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email address",
      } as QuoteFormResponse);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Quote request submission:", {
      name,
      email,
      serviceType,
      description,
      budgetRange,
    });

    res.json({
      success: true,
      message:
        "Thank you for your quote request. We'll get back to you within 48 hours!",
    } as QuoteFormResponse);
  } catch (error) {
    console.error("Quote form error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    } as QuoteFormResponse);
  }
};
