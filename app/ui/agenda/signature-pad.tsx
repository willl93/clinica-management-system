'use client'

import { useRef, useEffect, useState } from 'react'

export default function SignaturePad({ onSave, onCancel }: { onSave: (signature: string) => void, onCancel: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'

        const getPos = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect()
            if (e instanceof MouseEvent) {
                return { x: e.clientX - rect.left, y: e.clientY - rect.top }
            } else {
                return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
            }
        }

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            setIsDrawing(true)
            const { x, y } = getPos(e)
            ctx.beginPath()
            ctx.moveTo(x, y)
        }

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing) return
            const { x, y } = getPos(e)
            ctx.lineTo(x, y)
            ctx.stroke()
        }

        const stopDrawing = () => {
            setIsDrawing(false)
            ctx.closePath()
        }

        canvas.addEventListener('mousedown', startDrawing)
        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('mouseup', stopDrawing)
        canvas.addEventListener('touchstart', startDrawing)
        canvas.addEventListener('touchmove', draw)
        canvas.addEventListener('touchend', stopDrawing)

        return () => {
            canvas.removeEventListener('mousedown', startDrawing)
            canvas.removeEventListener('mousemove', draw)
            canvas.removeEventListener('mouseup', stopDrawing)
            canvas.removeEventListener('touchstart', startDrawing)
            canvas.removeEventListener('touchmove', draw)
            canvas.removeEventListener('touchend', stopDrawing)
        }
    }, [isDrawing])

    const handleSave = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const dataUrl = canvas.toDataURL()
        onSave(dataUrl)
    }

    const handleClear = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h3 className="text-lg font-bold mb-4">Assinatura do Paciente</h3>
                <p className="text-sm text-gray-500 mb-4">Favor assinar abaixo para confirmar o atendimento.</p>

                <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="border-2 border-dashed border-gray-300 rounded-md w-full cursor-crosshair bg-gray-50"
                />

                <div className="flex justify-between mt-6">
                    <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                        Cancelar
                    </button>
                    <div className="flex gap-2">
                        <button onClick={handleClear} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                            Limpar
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Confirmar Atendimento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
