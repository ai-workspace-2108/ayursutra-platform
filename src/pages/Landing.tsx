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
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src="/logo.svg" alt="AyurSutra" className="h-8 w-8" />
              <span className="text-xl font-bold text-foreground">AyurSutra</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              )}
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
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                AyurSutra: Your Gateway to{" "}
                <span className="text-primary">Authentic Ayurveda</span>
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
                className="text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                <Leaf className="mr-2 h-5 w-5" />
                Join as a Practitioner
              </Button>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-16"
            >
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-card border rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">500+</div>
                      <div className="text-muted-foreground">Verified Practitioners</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">10,000+</div>
                      <div className="text-muted-foreground">Happy Patients</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">50+</div>
                      <div className="text-muted-foreground">Cities Covered</div>
                    </div>
                  </div>
                </div>
              </div>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
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
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
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
                  <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
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
                  <Card className="h-full">
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
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
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
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardHeader className="space-y-6 pb-8">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
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
                    className="text-lg px-8 py-6"
                    onClick={() => navigate("/auth")}
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
      <footer className="bg-card border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/logo.svg" alt="AyurSutra" className="h-8 w-8" />
                <span className="text-xl font-bold text-foreground">AyurSutra</span>
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