import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Users,
  Leaf,
  CircleDot,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function About() {
  const navigate = useNavigate();

  // Add TeamMember type so "leader" can be optional but always exists on the type
  type TeamMember = {
    name: string;
    role: string;
    initials: string;
    academic: {
      enrollment: string;
      year: string;
      semester: string;
      institution: string;
    };
    contact: {
      email: string;
      phone: string;
    };
    expertise: string;
    leader?: boolean;
  };

  // Team data
  const team: TeamMember[] = [
    {
      name: "Krish Kumar Gupta",
      role: "Team Leader & Project Coordinator",
      initials: "KG",
      academic: {
        enrollment: "240305105031",
        year: "1",
        semester: "3",
        institution: "Parul University",
      },
      contact: {
        email: "2403051050311@paruluniversity.ac.in",
        phone: "+91 6394948177",
      },
      expertise:
        "Spearheading the integration of traditional healthcare wisdom with cutting-edge technology solutions.",
      leader: true,
    },
    {
      name: "Arpan Singha",
      role: "Full-Stack Development & System Architecture",
      initials: "AS",
      academic: {
        enrollment: "230305105012",
        year: "6",
        semester: "3",
        institution: "Parul University",
      },
      contact: {
        email: "2303051050126@paruluniversity.ac.in",
        phone: "+91 7001835922",
      },
      expertise:
        "Backend systems, database optimization, API integration, and scalable architecture design.",
    },
    {
      name: "Dixit Malviya",
      role: "AI Integration & Technical Innovation",
      initials: "DM",
      academic: {
        enrollment: "240305105015",
        year: "2",
        semester: "2",
        institution: "Parul University",
      },
      contact: {
        email: "malviyadixit92@gmail.com",
        phone: "+91 7427092767",
      },
      expertise:
        "Machine learning integration, AI-powered solutions, and technical optimization.",
    },
    {
      name: "Aksh Narwani",
      role: "Market Research & Solution Analysis",
      initials: "AN",
      academic: {
        enrollment: "240305105002",
        year: "5",
        semester: "2",
        institution: "Parul University",
      },
      contact: {
        email: "2403501050025@paruluniversity.ac.in",
        phone: "+91 7878426752",
      },
      expertise:
        "Industry analysis, requirement gathering, and solution validation through research.",
    },
    {
      name: "Bhargavi Gohil",
      role: "UI/UX Design & User Experience",
      initials: "BG",
      academic: {
        enrollment: "240305105092",
        year: "3",
        semester: "2",
        institution: "Parul University",
      },
      contact: {
        email: "2403051050923@paruluniversity.ac.in",
        phone: "+91 8128557986",
      },
      expertise:
        "Interface design, user journey mapping, and accessibility optimization.",
    },
    {
      name: "Saurav Kumar",
      role: "Business Analytics & Performance Metrics",
      initials: "SK",
      academic: {
        enrollment: "240305105022",
        year: "2",
        semester: "2",
        institution: "Parul University",
      },
      contact: {
        email: "2403051050222@paruluniversity.ac.in",
        phone: "+91 9942527859",
      },
      expertise:
        "Data analysis, performance tracking, and business intelligence implementation.",
    },
  ] as const;

  const journey = [
    {
      phase: "Phase 1: Research & Discovery",
      items: [
        "Extensive online resource analysis",
        "Industry challenge identification",
        "Market gap assessment",
        "Initial problem formulation",
      ],
    },
    {
      phase: "Phase 2: Expert Guidance",
      items: [
        "Query formulation and refinement",
        "Mentorship with Dr. Vaibhav Gandhi Sir",
        "Expert consultation coordination",
        "Solution direction clarification",
      ],
    },
    {
      phase: "Phase 3: Specialist Consultation",
      items: [
        "Connection with Dr. Yamni Mam",
        "Panchakarma expertise integration",
        "Practical challenge understanding",
        "Solution refinement and validation",
      ],
    },
    {
      phase: "Phase 4: Solution Development",
      items: [
        "Technical architecture planning",
        "Comprehensive feature design",
        "Platform development and testing",
        "Final solution optimization",
      ],
    },
  ] as const;

  function Avatar({ initials, alt }: { initials: string; alt: string }) {
    return (
      <div
        className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold"
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b"
        aria-label="Page header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Back to Home</span>
            </Button>
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="AyurSutra logo" className="h-7 w-7" />
              <span className="font-semibold text-lg">About AyurSutra</span>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>About</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header & Intro */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-6"
          aria-labelledby="about-header"
        >
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Our Mission
          </div>
          <h1 id="about-header" className="text-4xl sm:text-5xl font-bold leading-tight text-primary">
            About AyurSutra
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforming Traditional Healthcare Through Technology
          </p>
          <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-amber-500/80" aria-hidden="true" />
          <div className="max-w-3xl mx-auto text-left space-y-3 text-muted-foreground">
            <p>
              Our mission is to bridge traditional Ayurvedic practices with modern technology, making authentic
              care accessible and efficient.
            </p>
            <p>
              We observed inefficiencies in Panchakarma clinic operations—manual scheduling, fragmented patient
              tracking, and resource allocation challenges.
            </p>
            <p>
              AyurSutra addresses these with a comprehensive, practitioner-centered practice management platform.
            </p>
          </div>
        </motion.section>

        <Separator />

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="space-y-6"
          aria-labelledby="team-header"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="text-center md:text-left space-y-2">
              <h2 id="team-header" className="text-3xl sm:text-4xl font-bold text-primary">
                Meet the AyurSutra Team
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                A dedicated group of innovators combining technical expertise with deep respect for traditional
                Ayurvedic principles to create comprehensive healthcare solutions.
              </p>
            </div>
            <Badge variant="outline" className="border-primary/40 text-primary">
              Project Code: VH6_PIT_147
            </Badge>
          </div>

          {/* Leader first */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <Card className={`h-full card-hover ${member.leader ? "ring-1 ring-primary/30" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <Avatar initials={member.initials} alt={`${member.name} avatar`} />
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          {member.leader && (
                            <Badge className="h-5" variant="secondary">
                              Team Leader
                            </Badge>
                          )}
                          <span className="text-foreground/80">{member.role}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">Academic Details</div>
                      <div className="text-muted-foreground">
                        Enrollment: {member.academic.enrollment}
                      </div>
                      <div className="text-muted-foreground">
                        Year: {member.academic.year} • Semester: {member.academic.semester}
                      </div>
                      <div className="text-muted-foreground">{member.academic.institution}</div>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <div className="font-medium">Contact</div>
                      <div className="flex items-center gap-2 text-muted-foreground break-all">
                        <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {member.contact.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {member.contact.phone}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <div className="font-medium">Focus & Expertise</div>
                      <p className="text-muted-foreground">{member.expertise}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA beneath team */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
            <Button onClick={() => navigate("/role-selection")}>Get Started</Button>
            <Button variant="outline" asChild>
              <a href="mailto:team@ayursutra.example" aria-label="Contact Our Team">
                Contact Our Team
              </a>
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Learn More About Our Solution
            </Button>
          </div>
        </motion.section>

        <Separator />

        {/* Journey Section */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="space-y-6"
          aria-labelledby="journey-header"
        >
          <h2 id="journey-header" className="text-2xl sm:text-3xl font-semibold">
            Our Development Journey
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Narrative */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Background & Narrative</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Our journey began with deep research into traditional Panchakarma practice management and its
                  modern-day challenges: manual scheduling, fragmented patient tracking, and resource constraints.
                </p>
                <p>
                  Guided by our mentor, <strong>Dr. Vaibhav Gandhi Sir</strong>, we refined our domain
                  understanding and shaped a solution-oriented approach.
                </p>
                <p>
                  Expert consultations with <strong>Dr. Yamni Mam</strong>, a Panchakarma specialist, ensured
                  that AyurSutra respects traditional protocols while delivering modern efficiency.
                </p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Key milestones across research, guidance, consultation, and development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
                  <div className="space-y-6">
                    {journey.map((block, i) => (
                      <div key={block.phase} className="relative">
                        <div className="absolute -left-0.5 top-1">
                          <CircleDot className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <div className="ml-2">
                          <div className="font-medium text-foreground">{block.phase}</div>
                          <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                            {block.items.map((it) => (
                              <li key={it}>{it}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <Separator />

        {/* Expert Acknowledgment */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="space-y-6"
          aria-labelledby="ack-header"
        >
          <h2 id="ack-header" className="text-2xl sm:text-3xl font-semibold">
            Expert Guidance Acknowledgment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <CardTitle>Mentor: Dr. Vaibhav Gandhi Sir</CardTitle>
                    <CardDescription>Project Mentor & Healthcare Domain Guide</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Contribution: Strategic guidance, problem refinement, and expert network facilitation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <CardTitle>Domain Expert: Dr. Yamni Mam</CardTitle>
                    <CardDescription>Panchakarma Therapy Expert</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Contribution: Practical insights, traditional knowledge integration, and solution validation.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <Separator />

        {/* Accessibility & Assurance Highlights */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          aria-label="Standards and compliance"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle>Responsive by Design</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Optimized across desktop (3-column), tablet (2-column), and mobile (single column) for clarity and speed.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle>Accessibility Aligned</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Semantic structure, proper headings, alt text, keyboard navigation, and high contrast for readability.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle>Performance Conscious</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Lightweight typography, progressive loading, and efficient layouts for fast rendering.
            </CardContent>
          </Card>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
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