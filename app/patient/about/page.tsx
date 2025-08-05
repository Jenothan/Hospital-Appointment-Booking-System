"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHospitalInfo } from '@/contexts/HospitalInfoContext';
import { 
  Heart, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Stethoscope,
  Activity,
  Shield,
  ChevronRight
} from 'lucide-react';

const services = [
  {
    title: "Emergency Care",
    description: "24/7 emergency medical services with state-of-the-art equipment and experienced staff.",
    image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: <Heart className="w-6 h-6" />
  },
  {
    title: "Cardiology",
    description: "Comprehensive heart care including diagnostics, treatment, and surgical procedures.",
    image: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: <Activity className="w-6 h-6" />
  },
  {
    title: "Pediatrics",
    description: "Specialized care for children from infancy through adolescence.",
    image: "https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: <Users className="w-6 h-6" />
  },
  {
    title: "Surgery",
    description: "Advanced surgical procedures with minimally invasive techniques.",
    image: "https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: <Stethoscope className="w-6 h-6" />
  }
];

const team = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief Medical Officer",
    specialty: "Cardiology",
    image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400",
    experience: "15+ years"
  },
  {
    name: "Dr. Michael Chen",
    role: "Head of Emergency",
    specialty: "Emergency Medicine",
    image: "https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=400",
    experience: "12+ years"
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Pediatric Specialist",
    specialty: "Pediatrics",
    image: "https://images.pexels.com/photos/4173258/pexels-photo-4173258.jpeg?auto=compress&cs=tinysrgb&w=400",
    experience: "10+ years"
  },
  {
    name: "Dr. James Wilson",
    role: "Chief Surgeon",
    specialty: "General Surgery",
    image: "https://images.pexels.com/photos/5407764/pexels-photo-5407764.jpeg?auto=compress&cs=tinysrgb&w=400",
    experience: "18+ years"
  }
];

const stats = [
  { number: "50,000+", label: "Patients Treated", icon: <Users className="w-8 h-8" /> },
  { number: "25+", label: "Years of Service", icon: <Award className="w-8 h-8" /> },
  { number: "24/7", label: "Emergency Care", icon: <Clock className="w-8 h-8" /> },
  { number: "98%", label: "Patient Satisfaction", icon: <Shield className="w-8 h-8" /> }
];

export default function HospitalAbout() {
  const {hospitalInfo} = useHospitalInfo()
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1200')",
          }}
        >
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>
        
        <div className={`relative z-10 text-center text-white px-4 max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Caring for Your Health
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200 leading-relaxed">
            Providing exceptional medical care with compassion and expertise for over 25 years
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-300">
              Our Services
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 transition-colors duration-300">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center text-white transition-all duration-700 delay-${index * 200} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="flex justify-center mb-4 text-teal-400 transform hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2 text-white">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">About Our Hospital</Badge>
              <h2 className="text-4xl font-bold text-slate-800 leading-tight">
                Dedicated to Excellence in Healthcare
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                For over 25 years, MedCenter Hospital has been at the forefront of medical excellence, 
                providing comprehensive healthcare services to our community. Our commitment to patient care, 
                cutting-edge technology, and medical innovation has made us a trusted name in healthcare.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Patient-Centered Care</h3>
                    <p className="text-slate-600">Every decision we make is focused on improving patient outcomes and experience.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Medical Excellence</h3>
                    <p className="text-slate-600">Our team of specialists delivers the highest quality medical care using advanced technology.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img 
                  src="https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Hospital interior"
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 mb-4">Our Services</Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Comprehensive Medical Care</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We offer a wide range of medical services with state-of-the-art facilities and expert healthcare professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-slate-200">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 text-teal-600 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 mb-4">Our Team</Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Meet Our Expert Doctors</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our highly skilled medical professionals are dedicated to providing the best possible care for our patients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((doctor, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-slate-200">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                    <div className="text-sm font-medium">{doctor.experience}</div>
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-slate-800 mb-1 group-hover:text-teal-600 transition-colors duration-300">
                    {doctor.name}
                  </h3>
                  <p className="text-teal-600 font-medium mb-2">{doctor.role}</p>
                  <p className="text-slate-600">{doctor.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6 text-teal-400">Our Mission</h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                To provide exceptional, compassionate healthcare services that promote healing, 
                wellness, and quality of life for all members of our community. We are committed 
                to excellence in patient care, medical education, and research.
              </p>
              <div className="relative overflow-hidden rounded-lg group">
                <img 
                  src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Medical team"
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6 text-teal-400">Our Vision</h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                To be the premier healthcare provider in our region, recognized for our clinical 
                excellence, innovation, and commitment to improving the health and well-being of 
                the communities we serve.
              </p>
              <div className="relative overflow-hidden rounded-lg group">
                <img 
                  src="https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Hospital facility"
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 mb-4">Contact Us</Badge>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Get in Touch</h2>
              <p className="text-lg text-slate-600 mb-8">
                We're here to help you with all your healthcare needs. Contact us today to schedule an appointment or learn more about our services.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Address</h3>
                    <p className="text-slate-600">{hospitalInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Phone</h3>
                    <p className="text-slate-600">{hospitalInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Email</h3>
                    <p className="text-slate-600">{hospitalInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img 
                  src="https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Hospital building"
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}