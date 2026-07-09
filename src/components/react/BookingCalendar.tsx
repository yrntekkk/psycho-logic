import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, ChevronRight } from 'lucide-react';

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Asegurar que si el mes real cambia, el componente se actualice
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const newMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      if (newMonth.getTime() !== currentMonth.getTime()) {
        setCurrentMonth(newMonth);
      }
    }, 1000 * 60 * 60); // Revisar cada hora
    return () => clearInterval(interval);
  }, [currentMonth]);

  // Obtener días del mes actual
  const getDaysInMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const daysInMonth = React.useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);
  const firstDayOfWeek = daysInMonth[0].getDay(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !email) return;

    setLoading(true);
    
    // Preparar fecha y hora para el evento de calendario
    const dateStr = selectedDate.toISOString().split('T')[0];
    const startDateTime = `${dateStr}T${selectedTime}:00-04:00`; // Ajustar timezone según sea necesario

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, startDateTime })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al iniciar el pago: " + (data.error || "Desconocido"));
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-6 md:p-8 shadow-xl max-w-5xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Lado izquierdo: Fecha y Hora */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-medium text-foreground mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              1. Selecciona el Día
            </h3>
            
            {/* Cabecera del mes (Sin flechas de navegación) */}
            <div className="mb-4 flex items-center justify-center bg-white/20 p-3 rounded-2xl border border-white/30">
              <span className="font-semibold text-zinc-800 capitalize text-lg">
                {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentMonth)}
              </span>
            </div>

            {/* Grid del Calendario */}
            <div className="bg-white/30 p-4 rounded-2xl border border-white/40 shadow-inner">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {WEEKDAYS.map(day => (
                  <div key={day} className="text-xs font-bold text-zinc-500 tracking-wide uppercase">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map((date, i) => {
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const isPast = date < today;
                  const isDisabled = isPast; // Fines de semana YA NO ESTÁN bloqueados
                  const isSelected = selectedDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null); // Resetear hora al cambiar día
                      }}
                      className={`aspect-square flex items-center justify-center rounded-xl text-sm transition-all
                        ${isDisabled ? 'opacity-40 cursor-not-allowed bg-white/10 text-zinc-400' : 'hover:-translate-y-0.5 shadow-sm'}
                        ${isSelected 
                          ? 'bg-primary text-white font-bold shadow-lg shadow-primary/40 scale-105' 
                          : !isDisabled ? 'bg-white/60 text-zinc-700 hover:bg-white hover:text-primary font-medium' : ''}`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {selectedDate && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <h3 className="text-xl font-medium text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                2. Selecciona la Hora
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-3 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-0.5
                        ${isSelected 
                          ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                          : 'border-white/50 bg-white/50 text-zinc-700 hover:bg-white/80 shadow-sm'}`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Lado derecho: Datos y Confirmación */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            3. Tus Datos
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5 ml-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-white/50 rounded-2xl bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-zinc-400 text-zinc-800 shadow-inner"
                  placeholder="Ej. María Pérez"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5 ml-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-white/50 rounded-2xl bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-zinc-400 text-zinc-800 shadow-inner"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <p className="mt-2 ml-1 text-xs text-zinc-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-400 inline-block"></span>
                Recibirás el enlace de Google Meet en este correo.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-2">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/60 shadow-sm">
              <h4 className="font-semibold text-zinc-800 mb-3 text-sm uppercase tracking-wider">Resumen de tu reserva</h4>
              <p className="text-sm text-zinc-600 flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-lg text-primary shadow-sm"><CalendarIcon className="w-4 h-4" /></div>
                {selectedDate ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(selectedDate) : 'Día no seleccionado'}
              </p>
              <p className="text-sm text-zinc-600 flex items-center gap-3 mt-3">
                <div className="bg-white p-1.5 rounded-lg text-primary shadow-sm"><Clock className="w-4 h-4" /></div>
                {selectedTime ? `${selectedTime} hrs (Hora de Chile)` : 'Hora no seleccionada'}
              </p>
              <div className="mt-4 pt-4 border-t border-white/50 flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-500">Valor Consulta</span>
                <span className="text-lg font-bold text-zinc-800">$30.000 <span className="text-xs text-zinc-500 font-normal">CLP</span></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || !name || !email || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-white font-medium bg-primary hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                "Procesando de forma segura..."
              ) : (
                <>
                  Pagar de forma segura en Flow
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            <div className="text-center mt-4">
              <span className="text-[11px] text-zinc-400 font-medium">Conexión cifrada de extremo a extremo</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
