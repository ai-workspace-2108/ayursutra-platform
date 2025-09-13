import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Leaf, 
  Shield, 
  Star, 
  Users, 
  Calendar,
  Award,
  MapPin,
  Menu
} from "lucide-react";
import { useNavigate } from "react-router";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const TiltCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <motion.div
      whileHover={{ rotateX: 6, rotateY: -6, translateZ: 8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
};

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Verified Practitioners",
      description: "All practitioners are thoroughly verified and certified in Ayurvedic medicine."
    },
    {
      icon: Calendar,
      title: "Easy Appointment Booking",
      description: "Schedule consultations with your preferred practitioners seamlessly."
    },
    {
      icon: Users,
      title: "Patient-Practitioner Connection",
      description: "Bridge the gap between authentic Ayurvedic care and modern convenience."
    },
    {
      icon: Award,
      title: "Digital Presence",
      description: "Practitioners can build their professional digital presence and reach more patients."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Ayurvedic Practitioner",
      content: "AyurSutra has transformed how I connect with patients. The verification process gives credibility to my practice.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Patient",
      content: "Finding authentic Ayurvedic practitioners was never this easy. The platform is intuitive and trustworthy.",
      rating: 5
    },
    {
      name: "Dr. Meera Patel",
      role: "Panchakarma Specialist",
      content: "The appointment management system has streamlined my practice operations significantly.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background bg-[url('/assets/ChatGPT_Image_Sep_2__2025__08_24_19_AM.png')] bg-cover bg-center">
      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background/95 pointer-events-none" />

      {/* Floating gradient orbs for depth */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-primary/30 via-accent/30 to-primary/10 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-primary/20 via-chart-4/20 to-accent/10 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-gradient-to-tr from-chart-5/20 via-primary/10 to-chart-2/10 blur-3xl opacity-50" />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-md border-b border-border/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src="/assets/ChatGPT_Image_Sep_2__2025__08_48_00_AM.png" alt="AyurSutra" className="h-8 w-8 rounded" />
              <span className="text-xl font-bold text-foreground">
                <span className="bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">Ayur</span>Sutra
              </span>
            </div>

            {/* Right: Desktop actions */}
            <div className="hidden sm:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/about")}>
                    About
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => navigate("/role-selection")}>
                    Get Started
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/about")}>
                    About
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu */}
            <div className="sm:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-3/4 sm:max-w-xs">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 grid gap-3">
                    {isAuthenticated ? (
                      <Button
                        className="w-full"
                        onClick={() => {
                          navigate("/dashboard");
                          setMobileOpen(false);
                        }}
                        aria-label="Go to Dashboard"
                      >
                        Dashboard
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => {
                          navigate("/role-selection");
                          setMobileOpen(false);
                        }}
                        aria-label="Get Started"
                      >
                        Get Started
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigate("/role-selection");
                        setMobileOpen(false);
                      }}
                      aria-label="Join as a Practitioner"
                    >
                      Join as a Practitioner
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigate("/about");
                        setMobileOpen(false);
                      }}
                      aria-label="About AyurSutra"
                    >
                      About
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4 relative">
              {/* Subtle animated conic gradient halo */}
              <div className="pointer-events-none absolute -inset-10 -z-10 mx-auto h-64 w-64 sm:h-80 sm:w-80 left-0 right-0 opacity-60">
                <motion.div
                  initial={{ rotate: 0, scale: 0.9 }}
                  animate={{ rotate: 360, scale: 1 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="h-full w-full rounded-full blur-3xl"
                  style={{
                    background:
                      "conic-gradient(from 0deg, color-mix(in oklab, var(--primary) 50%, transparent) 0deg, color-mix(in oklab, var(--chart-4) 55%, transparent) 120deg, color-mix(in oklab, var(--chart-5) 50%, transparent) 240deg, color-mix(in oklab, var(--primary) 50%, transparent) 360deg)",
                  }}
                />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight [text-wrap:balance]">
                <span className="bg-gradient-to-r from-primary via-chart-4 to-chart-2 bg-clip-text text-transparent">
                  AyurSutra: Your Gateway to Authentic Ayurveda
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Connect with verified Ayurvedic practitioners, book consultations, and embark on your journey to holistic wellness through the ancient wisdom of Ayurveda.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-transparent bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 shadow-[0_0_0_1px_inset_hsl(var(--border)),0_12px_40px_-12px_color-mix(in_oklab,var(--primary)60%,transparent)]"
                onClick={() => navigate("/role-selection")}
              >
                <Leaf className="mr-2 h-5 w-5" />
                Join as a Practitioner
              </Button>
            </motion.div>

            {/* Hero Visual - 3D Gradient Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.35 }}
              className="mt-16"
            >
              <TiltCard className="relative">
                {/* Soft moving gradient glows */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -left-8 h-44 w-44 rounded-full blur-3xl"
                  animate={{ x: [0, 12, 0], y: [0, -8, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab,var(--chart-4) 30%, transparent), transparent 70%)" }}
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full blur-3xl"
                  animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab,var(--chart-2) 28%, transparent), transparent 70%)" }}
                />

                {/* 3D panel */}
                <div className="relative border rounded-3xl p-8 shadow-2xl bg-card glass-hero ring-1 ring-primary/10 overflow-hidden">
                  {/* Animated gradient edge */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl">
                    <div className="absolute inset-0 rounded-3xl [mask-image:linear-gradient(transparent,black,transparent)]">
                      <motion.div
                        initial={{ x: "-30%" }}
                        animate={{ x: "130%" }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                        className="h-px w-1/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent absolute top-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent drop-shadow-sm">500+</div>
                      <div className="text-muted-foreground">Verified Practitioners</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold bg-gradient-to-r from-chart-4 to-primary bg-clip-text text-transparent drop-shadow-sm">10,000+</div>
                      <div className="text-muted-foreground">Happy Patients</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold bg-gradient-to-r from-chart-5 to-chart-2 bg-clip-text text-transparent drop-shadow-sm">50+</div>
                      <div className="text-muted-foreground">Cities Covered</div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-16"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
                Bridging Ancient Wisdom with Modern Convenience
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The Ayurvedic industry faces fragmentation, making it difficult for patients to find authentic practitioners and for practitioners to reach their ideal patients. AyurSutra solves this by creating a unified, professional platform.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-foreground">The Challenge</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Patients struggle to find verified, authentic Ayurvedic practitioners</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Practitioners lack digital presence and patient management tools</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Fragmented industry with no centralized platform for quality assurance</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-foreground">Our Solution</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Comprehensive verification system for practitioner credibility</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Unified platform for appointment booking and patient management</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Digital tools to help practitioners grow their practice</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-16"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-chart-3 to-chart-5 bg-clip-text text-transparent">
                Empowering the Ayurvedic Ecosystem
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform provides comprehensive tools and features designed to serve both practitioners and patients in the Ayurvedic community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <TiltCard>
                    <Card className="h-full text-center hover:shadow-xl transition-all duration-300 glass-card ring-1 ring-primary/10 hover:-translate-y-1 hover:scale-[1.01]">
                      <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-16"
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Trusted by Practitioners and Patients
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See what our community has to say about their experience with AyurSutra.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <TiltCard>
                    <Card className="h-full glass-card hover:shadow-xl transition-all duration-300 ring-1 ring-primary/10">
                      <CardHeader>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <CardDescription className="text-base italic">
                          "{testimonial.content}"
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <div className="font-semibold bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 glass-card ring-1 ring-primary/10">
              <CardHeader className="space-y-6 pb-8">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-chart-4 to-primary bg-clip-text text-transparent">
                    Ready to Begin Your Ayurvedic Journey?
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Join thousands of patients and practitioners who trust AyurSutra for authentic Ayurvedic care.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20"
                    onClick={() => navigate("/role-selection")}
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Join Our Network
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/logo.svg" alt="AyurSutra" className="h-8 w-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
                  AyurSutra
                </span>
              </div>
              <p className="text-muted-foreground">
                Connecting authentic Ayurvedic practitioners with patients seeking holistic wellness.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Platform</h3>
              <div className="space-y-2">
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Find Practitioners</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Join as Practitioner</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">How it Works</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Support</h3>
              <div className="space-y-2">
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Help Center</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Contact Us</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Community</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Legal</h3>
              <div className="space-y-2">
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Privacy Policy</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Terms of Service</div>
                <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Cookie Policy</div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-muted-foreground">
              © 2024 AyurSutra. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Twitter</div>
              <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">LinkedIn</div>
              <div className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Instagram</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}