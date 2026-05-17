"use client";

import { 
  PlusCircle, 
  Route, 
  UserPlus, 
  FileStack, 
  History, 
  Settings,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  bg: string;
}

export function QuickActions() {
  const locale = useLocale();
  
  const actions: QuickAction[] = [
    {
      title: "Schedule Trip",
      description: "Assign driver & bus to a route",
      href: `/${locale}/trips`,
      icon: PlusCircle,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Create Route",
      description: "Define new stops and corridors",
      href: `/${locale}/routes`,
      icon: Route,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Add Operator",
      description: "Register new admin or support",
      href: `/${locale}/users`,
      icon: UserPlus,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Export Data",
      description: "Download CSV reports",
      href: `/${locale}/analytics`,
      icon: FileStack,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Security Logs",
      description: "Review system audit trail",
      href: `/${locale}/audit-logs`,
      icon: History,
      color: "text-rose-600",
      bg: "bg-rose-50"
    },


    {
      title: "System Config",
      description: "Manage global settings",
      href: "#",
      icon: Settings,
      color: "text-slate-600",
      bg: "bg-slate-50"
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Quick Actions</h3>
        <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">Manage shortcuts</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <Link 
            key={i} 
            href={action.href}
            className="group relative bg-white border border-slate-200 p-5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
            
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${action.bg} ${action.color} transition-transform group-hover:scale-110 duration-500`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{action.title}</h4>
                <p className="text-[11px] font-medium text-slate-500 leading-tight">{action.description}</p>
              </div>
            </div>
            
            <div className={`absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500 ${action.color.replace('text', 'bg')} opacity-0 group-hover:opacity-100 w-0 group-hover:w-full`}></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
