"use client";

import { useRef, useState } from "react";
import { signProposal } from "@/lib/actions/proposals";
import { Button } from "@/components/ui/button";

interface ProposalSignFormProps {
  token: string;
  businessName: string;
}

export function ProposalSignForm({ token, businessName }: ProposalSignFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    setDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0]!.clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0]!.clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0]!.clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0]!.clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDraw() {
    setDrawing(false);
  }

  function clear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }

  async function handleSubmit() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const result = await signProposal(token, dataUrl);
    if (result.error) {
      setError(result.error);
    } else {
      setSigned(true);
    }
  }

  if (signed) {
    return (
      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Thank you!</p>
        <p className="text-sm text-muted">Your proposal for {businessName} has been signed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Sign below to accept this proposal for {businessName}.</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="border border-border rounded-lg bg-white w-full touch-none cursor-crosshair"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      {error && <p className="text-sm text-rose-500">{error}</p>}
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={clear}>Clear</Button>
        <Button type="button" onClick={handleSubmit}>Sign proposal</Button>
      </div>
    </div>
  );
}
