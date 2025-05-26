import React from 'react';

const About: React.FC = () => {
  return (
    <div>
      {/* Hero Section (Preserved) */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="About BestArtTechnology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/60" />
        </div>
        
        <div className="relative text-center text-white mx-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">About Us</h1>
        </div>
      </section>

      {/* New Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your Trusted Custom Mural and Canvas Print Store
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              BestArtTechnology transforms spaces with premium custom canvas prints and mural prints in Nepal, 
              designed to reflect your unique vision. We offer diverse wall art in Nepal, catering to every style, 
              from nature scenes to luxurious patterns. Discover modern wallpaper Nepal designs and create a home 
              that resonates with your unique aesthetic.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 rounded-xl p-8 md:p-12 mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-8">
              🎨 Why Choose Us?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "✅ Premium Quality Materials – Durable, vibrant, and made to last",
                "✅ Wide Range of Designs – From modern to classic, we've got it all",
                "✅ Customizable Murals – Personalize your mural to fit your unique space",
                "✅ Easy Installation – No fuss, no stress – just stunning walls",
                "✅ Over 10k+ Happy Customers – Trusted by art lovers and top interior designers",
                "✅ Local Artisans – Supporting Nepal's creative community"
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-800">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { value: "100", suffix: "k+", label: "Curated Mural Prints" },
              { value: "10", suffix: "k+", label: "Happy Customers" },
              { value: "50", suffix: "+", label: "Unique Categories" }
            ].map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl text-center">
                <div className="text-5xl font-bold text-indigo-700 mb-2">
                  {stat.value}<span className="text-3xl">{stat.suffix}</span>
                </div>
                <div className="text-lg font-medium text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Commitment
            </h3>
            <p className="text-gray-600">
              We are dedicated to providing the highest quality canvas prints and wall art in Nepal, 
              ensuring your space reflects your individual style while supporting local artists and 
              sustainable production methods.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;