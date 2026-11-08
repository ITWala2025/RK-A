"use client";

import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, ShieldAlert, CheckCircle2, Clock, Calculator,
  Mail, Phone, MapPin, Percent, Calendar, Edit3, Trash2, X, Plus,
  ShieldCheck, AlertTriangle
} from 'lucide-react';
import type { Customer } from '../../types/invoice';
import type { CompanyDirector, CreateDirectorInput, UpdateDirectorInput } from '../../types/director';
import { directorService } from '../../services/directorService';
import { formatCurrencyWithSymbol } from '../../utils/currencyConverter';

interface CustomerDirectorsTabProps {
  customer: Customer;
  onLaunchDirectorTax: (director: CompanyDirector) => void;
}

export const CustomerDirectorsTab: React.FC<CustomerDirectorsTabProps> = ({
  customer,
  onLaunchDirectorTax,
}) => {
  const [directors, setDirectors] = useState<CompanyDirector[]>([]);
  const [loading, setLoading] = useState(true);
  const [directorModalOpen, setDirectorModalOpen] = useState(false);
  const [editingDirector, setEditingDirector] = useState<CompanyDirector | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPpsn, setFormPpsn] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formShareholding, setFormShareholding] = useState<number>(50);
  const [formApptDate, setFormApptDate] = useState('2023-01-15');
  const [formSalary, setFormSalary] = useState<number>(75000);
  const [formPension, setFormPension] = useState<number>(10000);
  const [formMarital, setFormMarital] = useState<'single' | 'married_one_earner' | 'married_two_earners'>('married_one_earner');
  const [formIsSecretary, setFormIsSecretary] = useState(false);

  useEffect(() => {
    loadDirectors();
  }, [customer.id]);

  const loadDirectors = async () => {
    try {
      setLoading(true);
      const data = await directorService.getDirectorsByCustomer(customer.id);
      setDirectors(data);
    } catch (err) {
      console.error('Failed to load directors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingDirector(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormPpsn('');
    setFormAddress('');
    setFormShareholding(50);
    setFormApptDate(new Date().toISOString().split('T')[0]);
    setFormSalary(65000);
    setFormPension(8000);
    setFormMarital('single');
    setFormIsSecretary(false);
    setDirectorModalOpen(true);
  };

  const handleOpenEditModal = (dir: CompanyDirector) => {
    setEditingDirector(dir);
    setFormName(dir.name);
    setFormEmail(dir.email);
    setFormPhone(dir.phone || '');
    setFormPpsn(dir.ppsn);
    setFormAddress(dir.residentialAddress);
    setFormShareholding(dir.shareholdingPercentage);
    setFormApptDate(dir.appointmentDate);
    setFormSalary(dir.annualSalaryOrDrawings || 0);
    setFormPension(dir.pensionContributions || 0);
    setFormMarital(dir.maritalStatus || 'single');
    setFormIsSecretary(dir.isCompanySecretary);
    setDirectorModalOpen(true);
  };

  const handleSubmitDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPpsn.trim()) return;

    if (editingDirector) {
      await directorService.updateDirector(editingDirector.id, {
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        ppsn: formPpsn.trim().toUpperCase(),
        residentialAddress: formAddress.trim(),
        shareholdingPercentage: Number(formShareholding),
        appointmentDate: formApptDate,
        annualSalaryOrDrawings: Number(formSalary),
        pensionContributions: Number(formPension),
        maritalStatus: formMarital,
        isCompanySecretary: formIsSecretary,
      });
    } else {
      await directorService.createDirector({
        customerId: customer.id,
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        ppsn: formPpsn.trim().toUpperCase(),
        residentialAddress: formAddress.trim(),
        shareholdingPercentage: Number(formShareholding),
        appointmentDate: formApptDate,
        annualSalaryOrDrawings: Number(formSalary),
        pensionContributions: Number(formPension),
        maritalStatus: formMarital,
        isCompanySecretary: formIsSecretary,
      });
    }

    setDirectorModalOpen(false);
    loadDirectors();
  };

  const handleDeleteDirector = async (id: string) => {
    if (confirm('Are you sure you want to remove this director record?')) {
      await directorService.deleteDirector(id);
      loadDirectors();
    }
  };

  const proprietaryCount = directors.filter((d) => d.directorType === 'proprietary').length;
  const totalShareholding = directors.reduce((sum, d) => sum + (d.shareholdingPercentage || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            Company Directors &amp; Personal Tax Filings (Form 11)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Irish Companies Act 2014 statutory registers &amp; Revenue Commissioners Self-Assessment obligations for proprietary directors (&ge;15% shareholding).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition shadow-xs"
          >
            <UserPlus className="w-4 h-4" /> Add Company Director
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-gray-500">Registered Directors</span>
          <div className="text-xl font-bold text-gray-900 mt-1">{directors.length}</div>
          <div className="text-[11px] text-gray-400 mt-1">{totalShareholding}% equity accounted for</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-amber-600">Proprietary Directors (&ge;15%)</span>
          <div className="text-xl font-bold text-amber-700 mt-1">{proprietaryCount}</div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">Mandatory Irish Form 11 returns</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-600">Personal Tax Filing Workflow</span>
          <div className="text-sm font-semibold text-emerald-800 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Form 11 Integrated
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Pre-populates director emoluments &amp; PPSN</div>
        </div>
      </div>

      {/* Directors Cards / List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500">Loading company directors...</div>
      ) : directors.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">No company directors registered yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Add company directors so the firm can compute and file their personal Form 11 returns.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white text-xs font-medium rounded-lg hover:bg-emerald-800 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add First Director
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {directors.map((dir) => (
            <div
              key={dir.id}
              className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4 hover:border-emerald-200 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">{dir.name}</h4>
                    {dir.isCompanySecretary && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                        Company Secretary
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">PPSN: {dir.ppsn}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(dir)}
                    className="p-1 text-gray-400 hover:text-emerald-700 rounded hover:bg-emerald-50 transition"
                    title="Edit Director"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDirector(dir.id)}
                    className="p-1 text-gray-400 hover:text-red-700 rounded hover:bg-red-50 transition"
                    title="Delete Director"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {dir.directorType === 'proprietary' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 border border-amber-200 text-[11px]">
                    <ShieldAlert className="w-3.5 h-3.5" /> Proprietary Director ({dir.shareholdingPercentage}% equity)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700 text-[11px]">
                    Non-Proprietary ({dir.shareholdingPercentage}% equity)
                  </span>
                )}

                {dir.form11FilingRequired && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Mandatory Form 11
                  </span>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-gray-400 block text-[10px]">Appointed Date</span>
                  <span className="font-semibold text-gray-800">{dir.appointmentDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Annual Emoluments / Salary</span>
                  <span className="font-semibold text-emerald-800">
                    {formatCurrencyWithSymbol(dir.annualSalaryOrDrawings || 0, 'EUR')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Pension Contributions</span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrencyWithSymbol(dir.pensionContributions || 0, 'EUR')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Marital Status</span>
                  <span className="capitalize font-semibold text-gray-800">
                    {dir.maritalStatus?.replace(/_/g, ' ') || 'Single'}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-1 text-xs text-gray-600 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <a href={`mailto:${dir.email}`} className="text-blue-600 hover:underline truncate">
                    {dir.email}
                  </a>
                </div>
                {dir.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{dir.phone}</span>
                  </div>
                )}
                {dir.residentialAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-500 line-clamp-1">{dir.residentialAddress}</span>
                  </div>
                )}
              </div>

              {/* Action Button: File Personal Form 11 */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[11px] text-gray-500">
                  {dir.latestForm11Status ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Latest: {dir.latestForm11TaxYear} ({dir.latestForm11Status})
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">No return filed yet</span>
                  )}
                </div>

                <button
                  onClick={() => onLaunchDirectorTax(dir)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition shadow-xs"
                >
                  <Calculator className="w-3.5 h-3.5" /> Calculate &amp; File Form 11
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Director Modal */}
      {directorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSubmitDirector}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-gray-900">
                  {editingDirector ? 'Edit Company Director' : 'Register New Company Director'}
                </h4>
                <p className="text-xs text-gray-500">Company: {customer.company_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setDirectorModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Director Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Liam Byrne"
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Irish PPS Number (PPSN) *
                    <span className="text-[10px] text-gray-400 block font-normal">Mandatory for Revenue Form 11</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formPpsn}
                    onChange={(e) => setFormPpsn(e.target.value)}
                    placeholder="e.g. 8271920H"
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs font-mono uppercase focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="liam.byrne@emeraldcoastalfoods.ie"
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+353 87 123 4567"
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Residential Address *</label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="24 Harbour View, Howth, Co. Dublin"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Beneficial Shareholding %
                    <span className="text-[10px] text-gray-400 block font-normal">&ge;15% classifies as Proprietary</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formShareholding}
                    onChange={(e) => setFormShareholding(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={formApptDate}
                    onChange={(e) => setFormApptDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Annual Emoluments / Salary (&euro;)
                  </label>
                  <input
                    type="number"
                    value={formSalary}
                    onChange={(e) => setFormSalary(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Annual Pension Contributions (&euro;)
                  </label>
                  <input
                    type="number"
                    value={formPension}
                    onChange={(e) => setFormPension(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Marital Tax Status</label>
                  <select
                    value={formMarital}
                    onChange={(e) => setFormMarital(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="single">Single (&euro;44,000 SRCOP)</option>
                    <option value="married_one_earner">Married (One Earner - &euro;53,000 SRCOP)</option>
                    <option value="married_two_earners">Married (Two Earners - &euro;88,000 SRCOP)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={formIsSecretary}
                      onChange={(e) => setFormIsSecretary(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-gray-300"
                    />
                    <span>Acts as Company Secretary (CRO)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDirectorModalOpen(false)}
                className="px-3.5 py-2 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 text-white font-semibold text-xs rounded-lg hover:bg-emerald-800"
              >
                {editingDirector ? 'Update Director Details' : 'Register Director'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
