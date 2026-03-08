import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(form.email, form.password, form.fullName);
        if (error) throw error;
        toast.success("Account created! You can now sign in.");
        setIsSignUp(false);
      } else {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        toast.success("Signed in successfully!");
        navigate("/admin");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </button>

        <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              {isSignUp ? <UserPlus className="w-6 h-6 text-primary" /> : <LogIn className="w-6 h-6 text-primary" />}
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isSignUp ? "Create Account" : "Admin Login"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isSignUp ? "Sign up for an admin account" : "Sign in to manage appointments"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Dr. Saleem"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="admin@clinic.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" variant="teal" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
