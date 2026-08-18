import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Compass,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Target,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';

export const CompanyProfileView: React.FC = () => {
  const { submitQuoteRequest } = useApp();

  const [quoteName, setQuoteName] = useState('');
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteEventType, setQuoteEventType] = useState('Festival / Concert (3000+ people)');
  const [quoteStationCount, setQuoteStationCount] = useState(2);
  const [quoteDate, setQuoteDate] = useState('');
  const [quoteLocation, setQuoteLocation] = useState('');
  const [quoteBranding, setQuoteBranding] = useState(true);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName.trim() || !quotePhone.trim()) return;

    submitQuoteRequest({
      name: quoteName,
      companyName: quoteCompany || 'Private Event',
      email: quoteEmail || 'contact@client.co.za',
      phone: quotePhone,
      eventType: quoteEventType,
      stationCount: Number(quoteStationCount),
      expectedDate: quoteDate || new Date().toISOString().split('T')[0],
      location: quoteLocation || 'Gauteng, South Africa',
      brandingRequested: quoteBranding,
      notes: quoteNotes,
    });

    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteName('');
      setQuoteCompany('');
      setQuotePhone('');
      setQuoteNotes('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="flex items-center gap-3">
            <Logo size="lg" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 inline-block">
              A Division of Maduba T Trading &amp; Investment Holdings PTY Ltd
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-3">
              Company Profile &amp; <span className="text-[#FBBD23]">Enterprise Solutions</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mt-2">
              South Africa&apos;s forward-thinking technology solutions provider specializing in mobile cellphone charging stations designed to enhance convenience, connectivity, and brand engagement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#FBBD23]" />
              <span>Vanderbijlpark &amp; Nationwide Deployment</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <Phone className="w-3.5 h-3.5 text-[#FBBD23]" />
              <span>073 092 5711 (WhatsApp)</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Us, Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Us */}
        <div className="p-8 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-slate-900 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#FBBD23]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              About Us
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              <strong>B - in Charge</strong> is a forward-thinking technology solutions provider specializing in cellphone charging stations designed to enhance convenience and connectivity. As a division of <strong>Maduba T Trading and Investment Holdings</strong>, we focus on delivering innovative solutions that improve customer experience in public spaces, retail environments, corporate offices, and event venues.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
            Driving engagement &amp; brand visibility across South Africa.
          </div>
        </div>

        {/* Mission */}
        <div className="p-8 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-slate-900 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#FBBD23]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Our Mission
            </h2>
            <ul className="text-xs text-slate-600 space-y-2 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-[#FBBD23] font-bold">•</span>
                <span>To bridge the gap between technology and convenience by providing secure and reliable cellphone charging stations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FBBD23] font-bold">•</span>
                <span>To help businesses &amp; organizations enhance customer satisfaction, engagement, and retention.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FBBD23] font-bold">•</span>
                <span>To drive sustainability by incorporating energy-efficient and eco-friendly GaN charging technologies.</span>
              </li>
            </ul>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold pt-2 border-t border-slate-100">
            Continuous innovation for corporate &amp; events.
          </div>
        </div>

        {/* Vision */}
        <div className="p-8 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-slate-900 flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#FBBD23]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Our Vision
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              To become the <strong>leading provider of smart charging solutions in South Africa</strong>, ensuring seamless connectivity and enhanced customer experiences in public and corporate spaces.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-800 font-semibold">
            ⚡ Always on, always connected, anywhere in SA.
          </div>
        </div>
      </section>

      {/* Our 4 Core Services */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#FBBD23] text-slate-900">
              Capabilities
            </span>
            <span className="text-xs text-slate-500 font-medium">Tailored Commercial &amp; Event Solutions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            Our Core Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service 1 */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#FBBD23] text-slate-900 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Cellphone Charging Stations for Corporate &amp; Commercial Spaces
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We provide customizable and secure cellphone charging stations for various business environments, including corporate offices, retail stores &amp; shopping malls, airports &amp; transportation hubs, and hospitality &amp; entertainment venues.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Corporate Offices', 'Shopping Malls', 'Airports', 'Hospitality'].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Service 2 */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#FBBD23] text-slate-900 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Event Charging Solutions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Our portable charging stations and power bank hubs are ideal for corporate events, trade shows, conferences, exhibitions, and music festivals. They keep attendees connected while boosting brand engagement through customized branding options.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Music Festivals', 'Trade Shows', 'Conferences', 'Sports Stadiums'].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Service 3 */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#FBBD23] text-slate-900 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Advertising &amp; Branding Opportunities
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Our charging stations serve as high-visibility marketing platforms for businesses. We offer custom vinyl wraps, digital screen ads, and sponsor logo integration that allow companies to showcase their brand while providing a valuable utility service.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Full Vinyl Wrapping', 'Digital Screen Ads', 'Sponsor Banners', 'QR Campaigns'].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Service 4 */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#FBBD23] text-slate-900 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Custom Charging Solutions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We work with businesses to design tailored charging solutions that align with their specific infrastructure. Whether integrating charging kiosks into existing venue architectural furniture or developing solar-powered mobile event trailers.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Solar Mobile Units', 'Tabletop Bar Pods', 'Integrated Furniture', 'Smart Kiosks'].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Official Contact Details & Operations Team */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Official Profile Information
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              Contact &amp; Operations
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Reach out to our executive operations team directly.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Business Address */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FBBD23]" />
                <span>Business Address</span>
              </span>
              <p className="text-slate-800 font-semibold leading-relaxed">
                1067 Plaatjie Street, <br />
                Bophelong 1913, <br />
                Vanderbijlpark, Gauteng, South Africa
              </p>
            </div>

            {/* General Contact */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FBBD23]" />
                <span>General Contact</span>
              </span>
              <div className="space-y-1 font-mono text-slate-800">
                <a
                  href="https://wa.me/27730925711"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-[#FBBD23] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>073 092 5711 (WhatsApp)</span>
                </a>
                <a
                  href="mailto:St.entertainment.tm@gmail.com"
                  className="flex items-center gap-2 hover:text-[#FBBD23] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FBBD23]" />
                  <span>St.entertainment.tm@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Operations Management Team */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#FBBD23]" />
                <span>Operations Management</span>
              </span>

              {/* Thabiso Maduba */}
              <div className="border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-sm">Thabiso Maduba</h4>
                <div className="text-[11px] text-slate-600 font-mono space-y-0.5 mt-0.5">
                  <div>📞 081 205 0748</div>
                  <div>✉️ ts.maduba.tm@gmail.com</div>
                </div>
              </div>

              {/* Tumelo Zakwe */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Tumelo Zakwe</h4>
                <div className="text-[11px] text-slate-600 font-mono space-y-0.5 mt-0.5">
                  <div>📞 071 734 6401</div>
                  <div>✉️ zakwet721@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Event Quote Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#FBBD23] text-slate-900">
                Inquire Online
              </span>
              <span className="text-xs text-slate-500 font-medium">Response within 24 business hours</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              Request Station Hire or Custom Quote
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Provide mobile charging stations for your festival, trade expo, or corporate offices.
            </p>
          </div>

          {quoteSubmitted ? (
            <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-emerald-800">
                Quote Request Received!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                Thank you! Our operations managers <strong>Thabiso Maduba</strong> &amp; <strong>Tumelo Zakwe</strong> will review your event requirements and send a customized proposal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nomsa Sithole"
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Red Bull South Africa, Standard Bank"
                    value={quoteCompany}
                    onChange={(e) => setQuoteCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. nomsa@company.co.za"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Cellphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 082 123 4567"
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Event / Solution Type
                  </label>
                  <select
                    value={quoteEventType}
                    onChange={(e) => setQuoteEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  >
                    <option value="Music Festival / Outdoor Concert">Music Festival / Outdoor Concert</option>
                    <option value="Corporate Expo / Trade Show">Corporate Expo / Trade Show</option>
                    <option value="Sports Stadium / Fan Zone">Sports Stadium / Fan Zone</option>
                    <option value="Permanent Mall / Retail Kiosk">Permanent Mall / Retail Kiosk</option>
                    <option value="Corporate Office Installation">Corporate Office Installation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Estimated Stations Needed
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={quoteStationCount}
                    onChange={(e) => setQuoteStationCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Venue / City Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nasrec, Sandton, or Durban"
                    value={quoteLocation}
                    onChange={(e) => setQuoteLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="brandingCheck"
                  checked={quoteBranding}
                  onChange={(e) => setQuoteBranding(e.target.checked)}
                  className="w-4 h-4 accent-[#FBBD23] cursor-pointer"
                />
                <label htmlFor="brandingCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Request custom company branding &amp; vinyl wrapping on stations
                </label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Specific Requirements / Questions
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your event footfall, power availability, or special requests..."
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:border-[#FBBD23]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-[#FBBD23] hover:bg-[#f5b316] text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Quote Request</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
