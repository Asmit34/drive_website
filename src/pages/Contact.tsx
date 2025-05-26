import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Construct email content
    const emailSubject = formData.subject || 'Message from Contact Form';
    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:oliasmit872@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open user's default email client in a new tab
    window.open(mailtoLink, '_blank');
    
    // Simulate success (since we can't track if they actually sent it)
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const phoneNumber = '+977-9803337100';
  const emailAddress = 'bestarttechnology@gmail.com';
  const googleMapsLink = 'https://maps.app.goo.gl/ZYzqnPnDdJSmyoTM7';

  const openGoogleMaps = () => {
    window.open(googleMapsLink, '_blank');
  };

  return (
    <div>
      {/* Hero Section (unchanged) */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1692695/pexels-photo-1692695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/60" />
        </div>
        
        <div className="relative text-center text-white mx-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Contact Us</h1>
        </div>
      </section>

      {/* Contact Section (unchanged except for form) */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information (unchanged) */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6 text-indigo-900">Get in Touch</h2>
            
            <p className="text-gray-700 mb-8">
              We'd love to hear from you. Whether you have a question about our artworks, need assistance with a commission, or just want to say hello, we're here to help.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mt-1 bg-amber-100 p-2 rounded-md text-amber-600">
                  <Mail size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-indigo-900">Email</h3>
                  <a 
                    href={`mailto:${emailAddress}`} 
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    {emailAddress}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-amber-100 p-2 rounded-md text-amber-600">
                  <Phone size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-indigo-900">Phone</h3>
                  <div className="text-gray-700">
                    <div className="mb-2">
                      WhatsApp: <a 
                        href={`https://api.whatsapp.com/send/?phone=9779803337100&text=Hello,+Best+Art+Technology&type=phone_number&app_absent=0`} 
                        className="hover:text-indigo-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {phoneNumber}
                      </a>
                    </div>
                    <div>
                      Viber: <a 
                        href={`https://api.whatsapp.com/send/?phone=9779803337100&text=Hello,+Best+Art+Technology&type=phone_number&app_absent=0`} 
                        className="hover:text-indigo-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {phoneNumber}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-amber-100 p-2 rounded-md text-amber-600">
                  <MapPin size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-indigo-900">Visit Our Gallery</h3>
                  <p className="text-gray-700 mb-2">
                   Sowyambhu, Sanobharang<br />
                    Kathmandu, Nepal<br />
                  </p>
                  <button
                    onClick={openGoogleMaps}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    <MapPin size={16} className="mr-1" />
                    See on Google Map
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-lg font-bold text-indigo-900 mb-4">Gallery Hours</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-700">Sunday - Friday</div>
                  <div className="text-gray-900 font-medium">10:00 AM - 6:00 PM</div>
                  
                  <div className="text-gray-700">Saturday</div>
                  <div className="text-gray-900 font-medium">Closed</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-serif font-bold mb-6 text-indigo-900">Send Us a Message</h2>
            
            {isSubmitted ? (
              <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6">
                <h3 className="font-bold text-lg mb-2">Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Artwork Information">Artwork Information</option>
                    <option value="Commission Request">Commission Request</option>
                    <option value="Gallery Visit">Gallery Visit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send size={18} className="mr-2" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;