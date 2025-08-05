"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import DocImg from "@/assets/Doctors-background.jpg"
import { 
  Heart, 
  Clock, 
  Shield, 
  Users, 
  Stethoscope, 
  Calendar, 
  Phone, 
  MapPin,
  Star,
  Award,
  Activity
} from "lucide-react";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/home");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="w-full flex justify-between items-center px-6 py-4 border-b bg-slate-100 shadow-sm">
        <div className="overflow-hidden animate-fade-in-delay">
          <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground flex size-8 md:size-10 items-center justify-center rounded-md shadow">
                  <GalleryVerticalEnd className="size-4 md:size-5" />
                </div>
                <div>
                  <h1 className="text-xl md:text-xl font-bold leading-tight text-gray-800">
                    NovaCare
                  </h1>
                  <h2 className="text-lg md:text-lg text-gray-600 -mt-1">
                    Hospital
                  </h2>
                </div>
            </div>
        </div>
        <div className="flex gap-3 animate-fade-in-delay">
          <Link href="/login">
            <Button 
              variant="outline" 
              className="text-slate-700 border-slate-500 hover:bg-slate-200 transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-slate-700 hover:bg-slate-800 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="flex flex-col lg:flex-row items-center justify-center px-6 py-12 gap-12">
          <div className="animate-slide-in-left-delay">
            <Image 
              src={DocImg}
              alt="Doctor-image" 
              width={500}
              height={400}
              className="w-full max-w-md object-cover rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
            />
          </div>
          
          <div className="text-center lg:text-left animate-slide-in-right-delay">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent animate-pulse-gentle">
                NovaCare Hospital
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
              Providing compassionate care and expert medical services. Book appointments, manage schedules, and access
              healthcare—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Why Choose CityCare Hospital?</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                We are committed to providing exceptional healthcare services with state-of-the-art facilities and experienced medical professionals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up-delay-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                    <Heart className="w-8 h-8 text-slate-700" />
                  </div>
                  <CardTitle className="text-slate-800">Expert Care</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600">
                    Our team of experienced doctors and nurses provide personalized care tailored to your needs.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up-delay-2">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                    <Clock className="w-8 h-8 text-slate-700" />
                  </div>
                  <CardTitle className="text-slate-800">24/7 Emergency</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600">
                    Round-the-clock emergency services with immediate response and critical care facilities.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up-delay-3">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                    <Shield className="w-8 h-8 text-slate-700" />
                  </div>
                  <CardTitle className="text-slate-800">Advanced Technology</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600">
                    State-of-the-art medical equipment and cutting-edge technology for accurate diagnosis and treatment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="px-6 py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Our Medical Services</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Comprehensive healthcare services across multiple specialties to meet all your medical needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Stethoscope, title: "General Medicine", desc: "Primary care and routine check-ups" },
                { icon: Heart, title: "Cardiology", desc: "Heart and cardiovascular care" },
                { icon: Activity, title: "Emergency Care", desc: "24/7 emergency medical services" },
                { icon: Users, title: "Pediatrics", desc: "Specialized care for children" },
              ].map((service, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                      <service.icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-2">{service.title}</h4>
                    <p className="text-sm text-slate-600">{service.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-16 bg-slate-700 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: "50+", label: "Expert Doctors", icon: Users },
                { number: "10,000+", label: "Happy Patients", icon: Heart },
                { number: "15+", label: "Years Experience", icon: Award },
                { number: "24/7", label: "Emergency Care", icon: Clock },
              ].map((stat, index) => (
                <div key={index} className="animate-fade-in-up">
                  <div className="mx-auto mb-4 p-3 bg-slate-600 rounded-full w-fit">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Get In Touch</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Have questions or need to schedule an appointment? We're here to help you 24/7.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                    <Phone className="w-6 h-6 text-slate-700" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Call Us</h4>
                  <p className="text-slate-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-slate-500">24/7 Emergency Hotline</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                    <MapPin className="w-6 h-6 text-slate-700" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Visit Us</h4>
                  <p className="text-slate-600">123 Healthcare Ave</p>
                  <p className="text-sm text-slate-500">Medical District, City</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                    <Calendar className="w-6 h-6 text-slate-700" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Book Online</h4>
                  <p className="text-slate-600">Schedule appointments</p>
                  <p className="text-sm text-slate-500">Available 24/7</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-sm text-center text-slate-500 py-6 animate-fade-in-delay-2">
        © 2025 NovaCare Hospital. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGentle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slide-in-left-delay {
          animation: slideInLeft 1s ease-out 0.2s both;
        }

        .animate-slide-in-right-delay {
          animation: slideInRight 1s ease-out 0.4s both;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.6s both;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-up-delay-1 {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .animate-fade-in-up-delay-2 {
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .animate-fade-in-up-delay-3 {
          animation: fadeInUp 0.8s ease-out 0.8s both;
        }

        .animate-pulse-gentle {
          animation: pulseGentle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}