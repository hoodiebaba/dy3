import React, { useEffect, useState } from "react";
import Api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function CreateTicket() {

  const navigate = useNavigate();

  const [siteList, setSiteList] = useState([]);
  const [cellList, setCellList] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    site: "",
    cells: [],
    priority: "Medium"
  });

  const fetchSites = async () => {
    try {

      const res = await Api.get({ url: "/discussions/siteList", inst: 0 });

      setSiteList(res?.data?.data || []);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleSiteChange = (site) => {

    const selected = siteList.find(s => s.siteName === site);

    if (selected?.cellNames) {
      setCellList(selected.cellNames.split(","));
    } else {
      setCellList([]);
    }

    setForm({
      ...form,
      site,
      cells: []
    });
  };

  const handleSubmit = async () => {

    if (!form.title) {
      toast.error("Title required");
      return;
    }

    if (!form.site) {
      toast.error("Select site");
      return;
    }

    if (form.cells.length === 0) {
      toast.error("Select cells");
      return;
    }

    try {

      await Api.post({
        url: "/tickets",
        data: form
      });

      toast.success("Ticket created");

      navigate("/tickets");

    } catch (error) {

      toast.error("Failed to create ticket");

    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border">

        <h2 className="text-xl font-semibold mb-6">
          Create Ticket
        </h2>

        <div className="space-y-5">

          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full border px-3 py-2 rounded"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Site</label>

            <select
              className="w-full border px-3 py-2 rounded"
              value={form.site}
              onChange={(e) => handleSiteChange(e.target.value)}
            >
              <option value="">Select Site</option>

              {siteList.map((s) => (
                <option key={s.siteName} value={s.siteName}>
                  {s.siteName}
                </option>
              ))}

            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Cells</label>

            <select
              multiple
              className="w-full border px-3 py-2 rounded"
              value={form.cells}
              onChange={(e) =>
                setForm({
                  ...form,
                  cells: [...e.target.selectedOptions].map(
                    (o) => o.value
                  )
                })
              }
            >

              {cellList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}

            </select>

          </div>

          <div>
            <label className="block text-sm mb-1">Priority</label>

            <select
              className="w-full border px-3 py-2 rounded"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={() => navigate("/tickets")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create Ticket
          </button>

        </div>

      </div>

    </div>
  );
}