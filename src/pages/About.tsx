import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShieldCheck, Users, Leaf, CheckCircle2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="AyurSutra" className="h-7 w-7" />
              <span className="font-semibold text-lg">About AyurSutra</span>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero / Mission */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Our Mission
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            Bridging Ancient Ayurvedic Wisdom with Modern Care
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            AyurSutra connects patients to verified Ayurvedic practitioners and empowers practitioners with
            elegant tools to manage appointments, craft care plans, and grow a trusted digital presence.
          </p>
        </motion.section>

        {/* What we do */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Verification First</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We vet practitioners thoroughly to ensure authenticity, credibility, and patient safety across the
              ecosystem.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Seamless Connection</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Patients discover the right experts, book consults easily, and stay engaged with care plans and
              follow-ups.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <CardTitle>Tools for Growth</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Practitioners build a modern digital presence and manage appointments and plans in one place.
            </CardContent>
          </Card>
        </motion.section>

        <Separator />

        {/* For Patients / For Practitioners */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="stat-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>For Patients</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <p>Find verified experts across Ayurveda specialties with transparent profiles.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <p>Book appointments seamlessly and receive personalized care plans.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <p>Stay on track with follow-ups aligned to your goals and daily schedule.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>For Practitioners</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <p>Establish credibility with verification and a professional profile.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <p>Manage appointments, patient data, and plans with streamlined workflows.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <p>Grow your digital presence and reach more of the right patients.</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <Separator />

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Safety & Trust</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We prioritize clinical safety through verification, clarity, and responsible workflows.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Patient-Centered</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Everything we build is in service of patient outcomes and practitioner excellence.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Respect for Tradition</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We honor the roots of Ayurveda while enabling modern, scalable access to care.
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="text-center"
        >
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Be Part of the AyurSutra Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ready to begin your journey? Join as a practitioner or explore care options as a patient.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/role-selection")}>
                  Join as Practitioner
                </Button>
                <Button onClick={() => navigate("/")}>Explore Platform</Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}
