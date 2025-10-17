import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SignInPage from "../../app/auth/signin/page";
import SignUpPage from "../../app/auth/signup/page";

// Mock the auth helpers
jest.mock("@/lib/auth-helpers", () => ({
  getCurrentUserWithProfile: jest.fn(),
}));

const mockSupabase = {
  auth: {
    signInWithOtp: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
};

describe("Authentication Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe("Sign In Page", () => {
    it("renders sign in form correctly", () => {
      render(<SignInPage />);
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
      expect(screen.getByLabelText("Email address")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i }))
        .toBeInTheDocument();
    });

    it("handles email input correctly", () => {
      render(<SignInPage />);

      const emailInput = screen.getByLabelText("Email address");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("shows loading state when submitting", () => {
      render(<SignInPage />);
      const emailInput = screen.getByLabelText("Email address");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });

    it("handles successful sign in", () => {
      render(<SignInPage />);
      const emailInput = screen.getByLabelText("Email address");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });

    it("shows validation errors for invalid email and password", () => {
      render(<SignInPage />);
      const emailInput = screen.getByLabelText("Email address");
      const passwordInput = screen.getByLabelText("Password");
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);
      fireEvent.change(passwordInput, { target: { value: "short" } });
      fireEvent.blur(passwordInput);
      expect(screen.getByText(/enter a valid email address/i))
        .toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i))
        .toBeInTheDocument();
    });
  });

  describe("Sign Up Page", () => {
    it("renders sign up form correctly", () => {
      render(<SignUpPage />);

      expect(screen.getByText("Create your account")).toBeInTheDocument();
      expect(screen.getByLabelText("Email address")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create account/i }))
        .toBeInTheDocument();
    });

    // Role selection removed in new UI

    it("shows validation errors for invalid email and password on sign up", () => {
      render(<SignUpPage />);
      const emailInput = screen.getByLabelText("Email address");
      const passwordInput = screen.getByLabelText("Password");
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);
      fireEvent.change(passwordInput, { target: { value: "short" } });
      fireEvent.blur(passwordInput);
      const alerts = screen.getAllByRole("alert");
      expect(
        alerts.some((a) =>
          /enter a valid email address/i.test(a.textContent || "")
        ),
      ).toBeTruthy();
      expect(
        alerts.some((a) =>
          /password must be at least 8 characters/i.test(a.textContent || "")
        ),
      ).toBeTruthy();
    });

    it("handles successful sign up", () => {
      render(<SignUpPage />);
      const emailInput = screen.getByLabelText("Email address");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });
  });
});
