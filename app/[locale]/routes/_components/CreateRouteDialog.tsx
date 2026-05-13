"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRoute } from "@/hooks/routes";
import { Plus, Trash2, MapPin, Navigation, Info, CircleDollarSign, Loader2, ArrowRight } from "lucide-react";
import { CreateRoutePayload, RouteStop, RouteFare } from "@/types/api/routes";

interface CreateRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRouteDialog({ open, onOpenChange }: CreateRouteDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateRoutePayload>({
    routeNumber: "",
    name: "",
    description: "",
    estimatedDuration: 0,
    estimatedDistance: 0,
    stops: [{ name: "", sequence: 1, latitude: 0, longitude: 0 }],
    fares: [],
    segments: []
  });

  const { mutate: create, isPending } = useCreateRoute(() => {
    onOpenChange(false);
    resetForm();
  });

  const resetForm = () => {
    setStep(1);
    setFormData({
      routeNumber: "",
      name: "",
      description: "",
      estimatedDuration: 0,
      estimatedDistance: 0,
      stops: [{ name: "", sequence: 1, latitude: 0, longitude: 0 }],
      fares: [],
      segments: []
    });
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { name: "", sequence: prev.stops.length + 1, latitude: 0, longitude: 0 }]
    }));
  };

  const removeStop = (index: number) => {
    if (formData.stops.length <= 2) return; // Minimum 2 stops for a route
    const newStops = formData.stops.filter((_, i) => i !== index).map((stop, i) => ({
      ...stop,
      sequence: i + 1
    }));
    setFormData(prev => ({ ...prev, stops: newStops }));
  };

  const updateStop = (index: number, field: keyof RouteStop, value: string | number) => {
    const newStops = [...formData.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setFormData(prev => ({ ...prev, stops: newStops }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    create(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Navigation className="w-6 h-6 text-primary" />
            Create New Route
          </DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? "General Information" : step === 2 ? "Define Stops" : "Fares & Segments"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="routeNumber">Route Number</Label>
                  <Input 
                    id="routeNumber" 
                    placeholder="e.g. R-01" 
                    value={formData.routeNumber}
                    onChange={e => setFormData(prev => ({ ...prev, routeNumber: e.target.value }))}
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="routeName">Route Name</Label>
                  <Input 
                    id="routeName" 
                    placeholder="e.g. Piazza - Bole" 
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed route description..." 
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="duration">Estimated Duration (mins)</Label>
                  <Input 
                    id="duration" 
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={e => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="distance">Estimated Distance (km)</Label>
                  <Input 
                    id="distance" 
                    type="number"
                    step="0.1"
                    value={formData.estimatedDistance}
                    onChange={e => setFormData(prev => ({ ...prev, estimatedDistance: parseFloat(e.target.value) }))}
                    required 
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Route Stops</h4>
                <Button type="button" variant="outline" size="sm" onClick={addStop} className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Add Stop
                </Button>
              </div>
              <div className="space-y-3">
                {formData.stops.map((stop, index) => (
                  <div key={index} className="flex items-end gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 group relative">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-1 flex flex-col items-center justify-center pt-6">
                          <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {stop.sequence}
                          </div>
                        </div>
                        <div className="col-span-11 space-y-1.5">
                          <Label>Stop Name</Label>
                          <Input 
                            placeholder="Enter stop name"
                            value={stop.name}
                            onChange={e => updateStop(index, "name", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pl-9">
                        <div className="space-y-1.5">
                          <Label className="text-[10px]">Latitude</Label>
                          <Input 
                            type="number" 
                            step="0.000001"
                            value={stop.latitude}
                            onChange={e => updateStop(index, "latitude", parseFloat(e.target.value))}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px]">Longitude</Label>
                          <Input 
                            type="number" 
                            step="0.000001"
                            value={stop.longitude}
                            onChange={e => updateStop(index, "longitude", parseFloat(e.target.value))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    {formData.stops.length > 2 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeStop(index)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-primary">Final Review</p>
                  <p className="text-xs text-primary/70">Please review the route configuration before submitting. You can define specific segment fares in the next update if needed.</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 space-y-4 border border-slate-100">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-500">Route Summary</span>
                  <span className="text-sm font-bold text-slate-900">{formData.routeNumber}: {formData.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Stops</p>
                    <p className="text-sm font-semibold">{formData.stops.length} Locations</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Distance</p>
                    <p className="text-sm font-semibold">{formData.estimatedDistance} km</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-6 border-t">
            {step > 1 && (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} disabled={isPending}>
                Back
              </Button>
            )}
            <div className="flex-1" />
            <Button type="submit" disabled={isPending} className="gap-2" variant="outline">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {step < 3 ? (
                <>Next <ArrowRight className="w-4 h-4" /></>
              ) : (
                "Create Route"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
