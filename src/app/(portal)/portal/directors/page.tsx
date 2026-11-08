"use client";

import { useEffect, useState } from "react";
import { useClientSession } from "@/lib/auth/session";
import { directorService } from "@/services/directorService";
import type { CompanyDirector } from "@/types/director";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Users, UserPlus, Mail, Phone, MapPin, ShieldAlert,
  Edit3, Trash2, X, Plus, ShieldCheck, CheckCircle2
} from "lucide-react";
import { formatCurrencyWithSymbol } from "@/utils/currencyConverter";

export default function PortalDirectorsPage() {
  const { customerId } = useClientSession();
  const [directors, setDirectors] = useState<CompanyDirector[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDirector, setEditingDirector] = useState<CompanyDirector | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPpsn, setFormPpsn] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formShareholding, setFormShareholding] = useState<number>(50);
  const [formApptDate, setFormApptDate] = useState("2023-01-15");
  const [formSalary, setFormSalary] = useState<number>(75000);
  const [formPension, setFormPension] = useState<number>(10000);
  const [formMarital, setFormMarital] = useState<"single" | "married_one_earner" | "married_two_earners">("single");
  const [formIsSecretary, setFormIsSecretary] = useState(false);

  useEffect(() => {
    if (!customerId) return;
    loadDirectors();
  }, [customerId]);

  const loadDirectors = async () => {
    try {
      setLoading(true);
      const data = await directorService.getDirectorsByCustomer(customerId);
      setDirectors(data);
    } catch (err) {
      console.error("Failed to load directors in portal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingDirector(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormPpsn("");
    setFormAddress("");
    setFormShareholding(50);
    setFormApptDate(new Date().toISOString().split("T")[0]);
    setFormSalary(65000);
    setFormPension(8000);
    setFormMarital("single");
    setFormIsSecretary(false);
    setModalOpen(true);
  };

  const handleOpenEditModal = (dir: CompanyDirector) => {
    setEditingDirector(dir);
    setFormName(dir.name);
    setFormEmail(dir.email);
    setFormPhone(dir.phone || "");
    setFormPpsn(dir.ppsn);
    setFormAddress(dir.residentialAddress);
    setFormShareholding(dir.shareholdingPercentage);
    setFormApptDate(dir.appointmentDate);
    setFormSalary(dir.annualSalaryOrDrawings || 0);
    setFormPension(dir.pensionContributions || 0);
    setFormMarital(dir.maritalStatus || "single");
    setFormIsSecretary(dir.isCompanySecretary);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPpsn.trim() || !customerId) return;

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
        customerId,
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

    setModalOpen(false);
    loadDirectors();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this director record?")) {
      await directorService.deleteDirector(id);
      loadDirectors();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-800" />
            Company Directors &amp; Statutory Officers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Keep your registered company directors, beneficial shareholding, and personal PPSN details up-to-date for CRO and Revenue personal tax filing.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Add Company Director
        </button>
      </div>

      {/* Info Notice on Irish Tax Laws */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Irish Statutory Compliance Notice &mdash; Revenue Form 11</p>
          <p className="text-emerald-800 leading-relaxed">
            Under Irish tax legislation, <strong>Proprietary Directors</strong> (holding 15% or more of ordinary share capital) are classified as self-employed for Revenue Self-Assessment purposes and <strong>must file an annual Form 11 Income Tax Return</strong>. RK &amp; Associate will use the details provided here to calculate and file your personal tax returns on ROS.
          </p>
        </div>
      </div>

      {/* Directors Grid */}
      {loading ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading company directors...</div>
      ) : directors.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-10 text-slate-500 space-y-3">
              <Users className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">No directors registered for this company yet</p>
              <p className="text-xs text-slate-400">
                Click "Add Company Director" above to submit your company's directors and officers.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {directors.map((dir) => (
            <Card key={dir.id} className="hover:shadow-md transition">
              <CardBody className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{dir.name}</h3>
                      {dir.isCompanySecretary && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                          Company Secretary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">PPSN: {dir.ppsn}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(dir)}
                      className="p-1.5 text-slate-400 hover:text-emerald-800 rounded hover:bg-slate-100 transition"
                      title="Edit Director Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dir.id)}
                      className="p-1.5 text-slate-400 hover:text-red-700 rounded hover:bg-red-50 transition"
                      title="Remove Director"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {dir.directorType === "proprietary" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 border border-amber-200 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5" /> Proprietary Director ({dir.shareholdingPercentage}% equity)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 text-[11px]">
                      Non-Proprietary ({dir.shareholdingPercentage}% equity)
                    </span>
                  )}
                  {dir.form11FilingRequired && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Form 11 Required
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Appointed Date</span>
                    <span className="font-semibold text-slate-800">{dir.appointmentDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Annual Emoluments / Salary</span>
                    <span className="font-semibold text-emerald-800">
                      {formatCurrencyWithSymbol(dir.annualSalaryOrDrawings || 0, "EUR")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pension Contributions</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrencyWithSymbol(dir.pensionContributions || 0, "EUR")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Marital Tax Status</span>
                    <span className="capitalize font-semibold text-slate-800">
                      {dir.maritalStatus?.replace(/_/g, " ") || "Single"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{dir.email}</span>
                  </div>
                  {dir.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{dir.phone}</span>
                    </div>
                  )}
                  {dir.residentialAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-500 line-clamp-1">{dir.residentialAddress}</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingDirector ? "Edit Director Details" : "Register Company Director"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Director Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Liam Byrne"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Irish PPSN *
                    <span className="text-[10px] text-slate-400 block font-normal">Mandatory for Revenue Form 11</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formPpsn}
                    onChange={(e) => setFormPpsn(e.target.value)}
                    placeholder="e.g. 8271920H"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono uppercase focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="liam.byrne@emeraldcoastalfoods.ie"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+353 87 123 4567"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address *</label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="24 Harbour View, Howth, Co. Dublin"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Beneficial Shareholding %
                    <span className="text-[10px] text-slate-400 block font-normal">&ge;15% classifies as Proprietary</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formShareholding}
                    onChange={(e) => setFormShareholding(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={formApptDate}
                    onChange={(e) => setFormApptDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Annual Emoluments / Salary (&euro;)
                  </label>
                  <input
                    type="number"
                    value={formSalary}
                    onChange={(e) => setFormSalary(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Annual Pension Contributions (&euro;)
                  </label>
                  <input
                    type="number"
                    value={formPension}
                    onChange={(e) => setFormPension(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Marital Tax Status</label>
                  <select
                    value={formMarital}
                    onChange={(e) => setFormMarital(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="single">Single (&euro;44,000 SRCOP)</option>
                    <option value="married_one_earner">Married (One Earner - &euro;53,000 SRCOP)</option>
                    <option value="married_two_earners">Married (Two Earners - &euro;88,000 SRCOP)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formIsSecretary}
                      onChange={(e) => setFormIsSecretary(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-slate-300"
                    />
                    <span>Company Secretary (CRO)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 text-white font-semibold text-xs rounded-lg hover:bg-emerald-900"
              >
                {editingDirector ? "Save Changes" : "Register Director"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
