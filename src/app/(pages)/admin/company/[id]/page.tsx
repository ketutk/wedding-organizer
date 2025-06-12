"use client";

import { useLoading } from "@/app/loaderContext";
import { useMessage } from "@/app/messageContext";
import { FetchData } from "@/lib/fetch";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CompanyDetail } from "./type";
import Image from "next/image";
import { Building2, Calendar, FileText, MessageSquare, PieChart, User } from "lucide-react";
import Link from "next/link";

export default function AdminCompanyDetail() {
  const { id } = useParams();
  const { showLoading } = useLoading();
  const { showMessage } = useMessage();
  const router = useRouter();

  const [data, setData] = useState<CompanyDetail | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await FetchData(`/api/admin/company/${id}`, "GET");
        console.log(data);
        setData(data);
      } catch (error) {
        if (typeof error == "string") {
          showMessage(error, "error");
        } else if (error instanceof Error) {
          showMessage(error.message, "error");
        }
        router.push("/admin/company");
      }
    };

    showLoading(fetch);
  }, []);

  const totalFeedbacks = data?.company._count.feedbacks || 1;
  const sentimentColors = {
    Positive: "bg-green-100 text-green-800",
    Neutral: "bg-blue-100 text-blue-800",
    Negative: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Company Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
          <Image src={data?.company.image || "/images/default.png"} alt={data?.company.name || ""} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800">{data?.company.name}</h1>
          <div className="mt-2 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
            <div className="overflow-y-auto max-h-32 p-2 text-sm text-gray-600">{data?.company.description || "No description provided"}</div>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-blue-600 font-medium">
          <span className="">Feedback URL: </span>
          <Link href={`/fillform/${data?.company.feedbackUrl}`} className="hover:underline" target="_blank">
            Click here
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-full">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Questionnaires</p>
              <p className="text-xl font-semibold">{data?.company.questionnaires.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Feedbacks</p>
              <p className="text-xl font-semibold">{totalFeedbacks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-full">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Owner</p>
              <p className="text-xl font-semibold">{data?.company.owner.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <PieChart className="w-5 h-5 text-gray-700" />
            Feedback Sentiment Distribution
          </h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-3">
            {data &&
              data.feedbacks.map((feedback) => (
                <div key={feedback.sentiment} className="flex items-center justify-between">
                  <span className="capitalize w-24 text-sm font-medium text-gray-700">{feedback.sentiment}</span>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${feedback.sentiment === "Positive" ? "bg-green-500" : feedback.sentiment === "Neutral" ? "bg-blue-500" : "bg-red-500"}`}
                        style={{ width: `${(feedback._count.sentiment / totalFeedbacks) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2 w-24">
                      <span className="text-sm font-medium text-gray-600">{feedback._count.sentiment}</span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-sm font-medium text-gray-500">{Math.round((feedback._count.sentiment / totalFeedbacks) * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Questionnaires Section */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-700" />
            Questionnaires ({data?.company.questionnaires.length})
          </h2>
        </div>
        <div className="divide-y">
          {data &&
            data.company.questionnaires.map((questionnaire) => (
              <div key={questionnaire.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{questionnaire.question}</h3>
                    {questionnaire.feedbackSummary && <p className="text-sm text-gray-600 mt-1">{questionnaire.feedbackSummary}</p>}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {questionnaire._count.feedbacks} Positive feedbacks
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(questionnaire.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${questionnaire.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{questionnaire.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
