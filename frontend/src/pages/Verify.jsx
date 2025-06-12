import React, { useState } from "react";

export default function VerifyCertificate() {
  const [activeNav, setActiveNav] = useState(0);

  const navItems = [
    "For Individuals",
    "For Businesses",
    "For Universities",
    "For Governments",
  ];

  return (
    <div className="w-full">
      {/* Top Black Navbar */}
      <div className="bg-black text-white py-4 px-[5vw] flex gap-5">
        {navItems.map((item, idx) => (
          <a
            href="#"
            key={item}
            className={`font-semibold text-base no-underline ${
              activeNav === idx ? "border-b-4 border-white pb-1" : ""
            }`}
            onClick={() => setActiveNav(idx)}
          >
            {item}
          </a>
        ))}
      </div>

      {/* White Navbar */}
      <div className="flex justify-between items-center py-4 px-5 border-b border-gray-300">
        <div className="text-xl font-bold">🎓 NLEARN</div>

        <div className="flex gap-2">
          <button className="bg-gray-100 px-3 py-1 rounded">Explore</button>
          <input
            type="text"
            placeholder="What do you want to learn ?"
            className="px-3 py-1 w-[250px] border rounded"
          />
          <button className="bg-gray-100 px-3 py-1 rounded">🔍</button>
        </div>

        <div className="flex items-center">
          <a href="#" className="ml-3">
            Careers
          </a>
          <a href="#" className="ml-3">
            Log In
          </a>
          <button className="ml-3 bg-blue-600 text-white px-3 py-1 rounded">
            Join for Free
          </button>
        </div>
      </div>

      {/* Certificate Section */}
      <div className="w-screen mt-8 px-[5vw] box-border">
        <h3 className="text-lg font-medium">Program Certificate</h3>
        <h1 className="text-2xl font-bold mt-1">
          Specialization in Machine Learning (ML)
        </h1>

        {/* Card Section */}
        <div className="flex flex-wrap gap-5 mt-5">
          {/* Left Card */}
          <div className="bg-blue-100 rounded-lg p-5 flex gap-4 w-full md:w-[60%]">
            <img
              src="/src/profile.jpg"
              alt="profile"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h4 className="m-0 font-semibold text-lg">
                Training Completed by Thanusha Dadi
              </h4>
              <p>June 06, 2025</p>
              <p>
                <strong>30 hours (approximately)</strong>
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Thanusha Dadi's account is verified. N-Learn certifies their
                successful completion of Specialization in Machine Learning
              </p>
            </div>
          </div>

          {/* Right Info */}
          <div className="w-full md:w-[35%]">
            <img src="/src/hat-logo.png" alt="logo" className="w-10" />
            <h4 className="font-semibold mt-2">
              Specialization in Machine Learning (ML)
            </h4>
            <p className="flex items-center gap-2 mt-1">
              Powered by{" "}
              <img
                src="/src/gcloud.png"
                alt="Google Cloud"
                className="inline w-20 align-middle"
              />
            </p>
            <p>⭐ 4.7 (592 ratings)</p>
            <p>👨‍🎓 220 Students Enrolled</p>
          </div>
        </div>

        {/* Certificate Info */}
        <p className="mt-8 text-gray-800">
          You’ve successfully completed your training —{" "}
          <strong>verified by N-Learn</strong>, powered by{" "}
          <strong>Google Cloud</strong>, and certified by{" "}
          <strong>Navikshaa Technologies</strong>. You are now a{" "}
          <strong>Navikshaa Certified Skilled Student</strong>, equipped with
          industry-ready skills.
        </p>

        {/* Certificate Image */}
        <div className="my-5 text-center">
          <img
            src="/src/certificate.jpg"
            alt="certificate"
            className="w-full max-w-[500px] mx-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <a
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-center"
            href="https://www.linkedin.com/sharing/share-offsite/?url=https://your-certificate-url.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on LinkedIn
          </a>

          <a
            href="/certificate.jpg"
            download="Thanusha-Certificate.jpg"
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-center"
          >
            Download Now
          </a>
        </div>

        {/* Final Note */}
        <p className="text-gray-800">
          Your internship with <strong>Navikshaa Technologies</strong> is still
          in progress. Complete all required tasks to unlock your Internship
          Completion Certificate, <strong>verified by N-Learn</strong> and{" "}
          <strong>powered by Google Cloud</strong>.
        </p>
      </div>
    </div>
  );
}
