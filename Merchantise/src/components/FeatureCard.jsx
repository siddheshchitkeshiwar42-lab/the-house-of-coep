import React from 'react';
import { Award, GraduationCap, ShieldCheck, Truck } from 'lucide-react';

export const FeatureCard = () => {
  const features = [
    {
      id: 'quality',
      icon: <Award className="feature-icon" size={26} />,
      title: 'Premium Quality',
      subtitle: 'Official & Verified'
    },
    {
      id: 'initiatives',
      icon: <GraduationCap className="feature-icon" size={26} />,
      title: 'Student Initiatives',
      subtitle: 'Powers COEP Clubs'
    },
    {
      id: 'payments',
      icon: <ShieldCheck className="feature-icon" size={26} />,
      title: 'Secure Payments',
      subtitle: 'Instant UPI Dynamic QR'
    },
    {
      id: 'delivery',
      icon: <Truck className="feature-icon" size={26} />,
      title: 'Fast Delivery',
      subtitle: 'Campus & Home Delivery'
    }
  ];

  return (
    <section className="features-strip">
      <div className="features-container">
        {features.map((feature) => (
          <div key={feature.id} className="feature-item">
            <div className="feature-icon-wrapper">
              {feature.icon}
            </div>
            <div className="feature-text">
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-subtitle">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
