import React, { useState, useEffect, useMemo, memo } from 'react';
import { 
  Shield, MapPin, Users, TrendingUp, AlertCircle, CheckCircle, 
  Clock, Navigation, Phone, Zap, CreditCard, BarChart3, 
  Settings, Play, Square, AlertTriangle, Home, User, 
  Bell, ChevronRight, Activity, Award, Calendar, Info
} from 'lucide-react';

// ============= PREMIUM THEME =============
const THEME = {
  colors: {
    primary: '#003087',      // Go2School Blue
    gold: '#FFD700',         // Go2School Gold
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    glass: 'rgba(255, 255, 255, 0.15)',
    glassBorder: 'rgba(255, 215, 0, 0.3)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #003087 0%, #0047AB 100%)',
    gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  },
  shadows: {
    premium: '0 20px 60px rgba(0, 48, 135, 0.3)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
    glow: '0 0 30px rgba(255, 215, 0, 0.4)',
  }
};

// ============= PREMIUM SVG ICONS =============
const ShieldLogo = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 5V11C4 16.55 7.84 21.74 13 23C18.16 21.74 22 16.55 22 11V5L12 2Z" 
          fill="url(#goldGradient)" stroke="#003087" strokeWidth="1.5"/>
    <path d="M9 12L11 14L15 10" stroke="#003087" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="goldGradient" x1="4" y1="2" x2="22" y2="23">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="100%" stopColor="#FFA500"/>
      </linearGradient>
    </defs>
  </svg>
);

const BusIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="12" rx="2" fill="#003087"/>
    <rect x="3" y="6" width="18" height="4" fill="#FFD700"/>
    <circle cx="7" cy="17" r="1.5" fill="#FFD700"/>
    <circle cx="17" cy="17" r="1.5" fill="#FFD700"/>
    <rect x="6" y="9" width="4" height="4" rx="0.5" fill="white" opacity="0.9"/>
    <rect x="14" y="9" width="4" height="4" rx="0.5" fill="white" opacity="0.9"/>
    <path d="M12 6L13 4H11L12 6Z" fill="#FFD700"/>
  </svg>
);

const SafetyBadge = ({ score, className = '' }: { score: number; className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill={score > 90 ? '#10B981' : score > 70 ? '#F59E0B' : '#EF4444'} opacity="0.2"/>
    <circle cx="50" cy="50" r="40" stroke={score > 90 ? '#10B981' : score > 70 ? '#F59E0B' : '#EF4444'} 
            strokeWidth="6" fill="none" strokeDasharray={`${score * 2.5} 251`} transform="rotate(-90 50 50)"/>
    <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#003087">{score}%</text>
  </svg>
);

// ============= TYPE DEFINITIONS =============
interface User {
  uid: string;
  email: string;
  role: 'parent' | 'driver' | 'admin';
  name: string;
  phone?: string;
}

interface Student {
  id: string;
  name: string;
  parentId: string;
  photo: string;
  routeId: string;
  busId: string;
  stopId: string;
  status: 'not-boarded' | 'boarded' | 'de-boarded';
  lastUpdate: Date;
  boardTime?: string;
}

interface Bus {
  id: string;
  name: string;
  driverId: string;
  routeId: string;
  location: { lat: number; lng: number };
  speed: number;
  status: 'idle' | 'on-route' | 'delayed';
  capacity: number;
  occupancy: number;
  schoolBrand: string;
  lastUpdate: Date;
  safetyScore: number;
}

interface Route {
  id: string;
  name: string;
  stops: Array<{ id: string; name: string; lat: number; lng: number; eta: string }>;
  schoolId: string;
}

interface Alert {
  id: string;
  type: 'boarding' | 'deboarding' | 'sos' | 'speed' | 'attendance';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  studentName?: string;
}

// ============= DEMO DATA =============
const DEMO_DATA = {
  users: [
    { uid: 'parent1', email: 'demo@go2school.in', role: 'parent' as const, name: 'Amit Sharma', phone: '+91-9876543210' },
    { uid: 'driver1', email: 'driver@go2school.in', role: 'driver' as const, name: 'Rajesh Kumar', phone: '+91-9876543211' },
    { uid: 'admin1', email: 'admin@go2school.in', role: 'admin' as const, name: 'Priya Singh', phone: '+91-9876543212' }
  ],
  students: [
    { id: 's1', name: 'Aarav Sharma', parentId: 'parent1', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav', routeId: 'r1', busId: 'G2S-01', stopId: 'stop1', status: 'boarded' as const, lastUpdate: new Date(), boardTime: '7:32 AM' },
    { id: 's2', name: 'Diya Sharma', parentId: 'parent1', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diya', routeId: 'r1', busId: 'G2S-01', stopId: 'stop2', status: 'boarded' as const, lastUpdate: new Date(), boardTime: '7:45 AM' }
  ],
  buses: [
    { id: 'G2S-01', name: 'G2S-01', driverId: 'driver1', routeId: 'r1', location: { lat: 22.5726, lng: 88.3639 }, speed: 32, status: 'on-route' as const, capacity: 40, occupancy: 38, schoolBrand: 'DPS Ruby Park', lastUpdate: new Date(), safetyScore: 95 }
  ],
  routes: [
    { 
      id: 'r1', 
      name: 'South City → DPS Ruby', 
      schoolId: 'school1',
      stops: [
        { id: 'stop1', name: 'South City Mall', lat: 22.5726, lng: 88.3639, eta: '8:15 AM' },
        { id: 'stop2', name: 'Jadavpur 8B', lat: 22.5626, lng: 88.3539, eta: '8:25 AM' },
        { id: 'stop3', name: 'Gariahat', lat: 22.5526, lng: 88.3639, eta: '8:32 AM' },
        { id: 'stop4', name: 'DPS Ruby Park', lat: 22.5426, lng: 88.3739, eta: '8:40 AM' }
      ]
    }
  ],
  alerts: [
    { id: 'a1', type: 'boarding' as const, message: 'boarded Bus G2S-01', studentName: 'Aarav', timestamp: new Date(Date.now() - 10 * 60 * 1000), severity: 'info' as const },
    { id: 'a2', type: 'boarding' as const, message: 'boarded Bus G2S-01', studentName: 'Diya', timestamp: new Date(Date.now() - 8 * 60 * 1000), severity: 'info' as const }
  ]
};

// ============= FIREBASE MOCK =============
class FirebaseService {
  private data = DEMO_DATA;
  private busMovementInterval: any = null;

  onSnapshot(collection: string, callback: Function) {
    callback(this.getCollection(collection));
    
    if (collection === 'buses') {
      let step = 0;
      const route = this.data.routes[0];
      this.busMovementInterval = setInterval(() => {
        step = (step + 1) % route.stops.length;
        const currentStop = route.stops[step];
        const nextStop = route.stops[(step + 1) % route.stops.length];
        
        this.data.buses = this.data.buses.map(bus => ({
          ...bus,
          location: {
            lat: currentStop.lat + (nextStop.lat - currentStop.lat) * (Math.random() * 0.3),
            lng: currentStop.lng + (nextStop.lng - currentStop.lng) * (Math.random() * 0.3)
          },
          speed: Math.max(25, Math.min(38, 30 + (Math.random() - 0.5) * 10)),
          safetyScore: Math.max(85, Math.min(98, 95 + (Math.random() - 0.5) * 10)),
          lastUpdate: new Date()
        }));
        callback(this.data.buses);
      }, 5000);
      
      return () => clearInterval(this.busMovementInterval);
    }
    
    return () => {};
  }

  getCollection(name: string) {
    switch(name) {
      case 'users': return this.data.users;
      case 'students': return this.data.students;
      case 'buses': return this.data.buses;
      case 'routes': return this.data.routes;
      case 'alerts': return this.data.alerts;
      default: return [];
    }
  }

  async updateDocument(collection: string, id: string, data: any) {
    const coll = this.getCollection(collection) as any[];
    const index = coll.findIndex((item: any) => item.id === id || item.uid === id);
    if (index !== -1) {
      coll[index] = { ...coll[index], ...data };
    }
    return { success: true };
  }
}

const firebase = new FirebaseService();

// ============= CUSTOM HOOKS =============
const useAuth = () => {
  const [user, setUser] = useState<User | null>(DEMO_DATA.users[0]);
  
  const switchRole = (role: 'parent' | 'driver' | 'admin') => {
    const newUser = DEMO_DATA.users.find(u => u.role === role);
    setUser(newUser || null);
  };

  return { user, switchRole };
};

const useTracking = (busId?: string) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.onSnapshot('buses', (data: Bus[]) => {
      setBuses(busId ? data.filter(b => b.id === busId) : data);
      setLoading(false);
    });
    return unsubscribe;
  }, [busId]);

  return { buses, loading };
};

const useStudents = (parentId?: string) => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    firebase.onSnapshot('students', (data: Student[]) => {
      setStudents(parentId ? data.filter(s => s.parentId === parentId) : data);
    });
  }, [parentId]);

  return { students };
};

// ============= PREMIUM UI COMPONENTS =============
const GlassCard = memo(({ children, className = '', onClick, gradient = false }: any) => (
  <div 
    onClick={onClick}
    className={`backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 ${
      gradient 
        ? 'bg-gradient-to-br from-white/20 to-white/10' 
        : 'bg-white/15'
    } border border-white/20 ${onClick ? 'cursor-pointer hover:bg-white/25 hover:scale-105' : ''} ${className}`}
    style={{ boxShadow: THEME.shadows.glass }}
  >
    {children}
  </div>
));

const PremiumButton = memo(({ children, onClick, variant = 'primary', icon: Icon, className = '' }: any) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-2xl',
    gold: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-blue-900 hover:shadow-2xl',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-2xl',
    ghost: 'bg-white/10 text-white border border-white/30 hover:bg-white/20',
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 justify-center transform hover:scale-105 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
});

// ============= LIVE MAP COMPONENT =============
const LiveMapView = memo(({ buses, routes, students }: { buses: Bus[], routes: Route[], students: Student[] }) => {
  const [focusedStop, setFocusedStop] = useState<string | null>(null);
  const currentBus = buses[0];
  const route = routes[0];

  const calculateETA = () => {
    if (!currentBus) return 'N/A';
    const distance = 4.2; // km to school
    const eta = (distance / (currentBus.speed || 30)) * 60;
    return `${Math.round(eta)} mins`;
  };

  return (
    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden" style={{ boxShadow: THEME.shadows.premium }}>
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-green-50">
        {/* Route Polyline */}
        <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))' }}>
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>
          <path 
            d={`M ${20 + route.stops[0].lat * 10} ${30 + route.stops[0].lng * 10} ${route.stops.map((s, i) => 
              `L ${20 + i * 150} ${100 + i * 80}`
            ).join(' ')}`}
            stroke="url(#routeGradient)" 
            strokeWidth="6" 
            fill="none"
            strokeLinecap="round"
            strokeDasharray="10 5"
          />
        </svg>

        {/* Stop Markers */}
        {route.stops.map((stop, i) => (
          <div 
            key={stop.id}
            className="absolute transition-all duration-300 cursor-pointer group"
            style={{ 
              left: `${15 + i * 22}%`, 
              top: `${25 + i * 15}%`,
              zIndex: focusedStop === stop.id ? 20 : 10
            }}
            onClick={() => setFocusedStop(focusedStop === stop.id ? null : stop.id)}
          >
            <div className="relative">
              <MapPin 
                size={40} 
                className="text-yellow-500 drop-shadow-lg group-hover:scale-125 transition-transform" 
                fill="#FFD700"
              />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                <GlassCard className="px-4 py-2">
                  <p className="text-white font-bold text-sm">{stop.name}</p>
                  <p className="text-yellow-300 text-xs">{stop.eta}</p>
                </GlassCard>
              </div>
            </div>
          </div>
        ))}

        {/* Live Bus */}
        {currentBus && (
          <div 
            className="absolute transition-all duration-5000 ease-linear"
            style={{ 
              left: `${20 + (currentBus.location.lat - 22.54) * 2000}%`, 
              top: `${30 + (currentBus.location.lng - 88.33) * 1500}%`,
              zIndex: 30
            }}
          >
            <div className="relative animate-bounce">
              <BusIcon className="w-16 h-16 drop-shadow-2xl" />
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <GlassCard gradient className="px-4 py-2 border-2 border-yellow-500">
                  <p className="text-white font-bold text-sm">{currentBus.name}</p>
                  <p className="text-yellow-300 text-xs">Speed: {currentBus.speed.toFixed(1)} km/h</p>
                </GlassCard>
              </div>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${
                currentBus.speed > 35 ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'
              }`}></div>
            </div>
          </div>
        )}
      </div>

      {/* Floating ETA Badge */}
      {currentBus && (
        <div className="absolute top-6 left-6 z-40">
          <GlassCard gradient className="border-2 border-yellow-500 animate-pulse">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-yellow-400" />
              <div>
                <p className="text-white text-xs font-medium">ETA to School</p>
                <p className="text-yellow-300 text-2xl font-bold">{calculateETA()}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-white text-xs">Bus: <span className="text-yellow-300 font-semibold">{currentBus.name}</span></p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Safety Score Badge */}
      {currentBus && (
        <div className="absolute bottom-6 right-6 z-40">
          <GlassCard gradient className="border-2 border-green-500">
            <div className="flex items-center gap-3">
              <SafetyBadge score={currentBus.safetyScore} className="w-16 h-16" />
              <div>
                <p className="text-white text-xs font-medium">Safety</p>
                <p className="text-green-300 text-xl font-bold">{currentBus.safetyScore}%</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-6 right-6 z-40 flex flex-col gap-2">
        <button className="p-3 rounded-xl bg-white/90 hover:bg-white shadow-lg transition-all">
          <Navigation size={20} className="text-blue-600" />
        </button>
      </div>
    </div>
  );
});

// ============= PREMIUM CHILD CARD =============
const PremiumChildCard = memo(({ student, bus }: { student: Student; bus?: Bus }) => {
  const statusColors = {
    'boarded': 'from-green-500 to-emerald-600',
    'de-boarded': 'from-blue-500 to-blue-600',
    'not-boarded': 'from-gray-400 to-gray-500'
  };

  const statusIcons = {
    'boarded': CheckCircle,
    'de-boarded': CheckCircle,
    'not-boarded': Clock
  };

  const StatusIcon = statusIcons[student.status];

  return (
    <GlassCard 
      gradient 
      className="min-w-[320px] border-2 border-yellow-500/30 hover:border-yellow-500 cursor-pointer"
      onClick={() => {}}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-yellow-500 overflow-hidden bg-white">
            <User size={60} className="text-blue-600 p-2" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r ${statusColors[student.status]} flex items-center justify-center border-2 border-white`}>
            <StatusIcon size={16} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-white text-xl font-bold">{student.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${statusColors[student.status]}`}>
              {student.status === 'boarded' ? 'Boarded' : 
               student.status === 'de-boarded' ? 'Dropped' : 
               'Not Boarded'}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-blue-100 text-sm flex items-center gap-2">
              <MapPin size={14} className="text-yellow-400" />
              {student.busId}
            </p>
            {student.boardTime && (
              <p className="text-yellow-300 text-xs">Boarded at {student.boardTime}</p>
            )}
          </div>
        </div>

        <ChevronRight size={24} className="text-white/50" />
      </div>
    </GlassCard>
  );
});

// ============= PARENT DASHBOARD - PREMIUM =============
const ParentDashboard = memo(({ user }: { user: User }) => {
  const { students } = useStudents(user.uid);
  const { buses } = useTracking(students[0]?.busId);
  const [routes] = useState(DEMO_DATA.routes);
  const [showSOS, setShowSOS] = useState(false);
  const [alerts] = useState(DEMO_DATA.alerts);

  const currentBus = buses[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 space-y-6">
        {/* Premium Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ShieldLogo className="w-12 h-12 drop-shadow-2xl" />
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Go2School
              </h1>
              <p className="text-white/80 text-sm">Welcome, {user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
              <Bell size={24} className="text-white" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Map Section */}
        <div>
          <LiveMapView buses={buses} routes={routes} students={students} />
        </div>

        {/* Children Cards - Horizontal Scroll */}
        <div>
          <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            <Users size={24} className="text-yellow-400" />
            Your Children
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {students.map(student => (
              <PremiumChildCard key={student.id} student={student} bus={currentBus} />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <GlassCard gradient className="text-center">
            <Activity size={32} className="mx-auto text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">{currentBus?.safetyScore || 0}%</p>
            <p className="text-blue-100 text-sm">Safety Score</p>
          </GlassCard>
          
          <GlassCard gradient className="text-center">
            <Award size={32} className="mx-auto text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-white">92%</p>
            <p className="text-blue-100 text-sm">On-Time Rate</p>
          </GlassCard>
          
          <GlassCard gradient className="text-center">
            <Calendar size={32} className="mx-auto text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">28</p>
            <p className="text-blue-100 text-sm">Days Active</p>
          </GlassCard>
        </div>

        {/* Recent Activity */}
        <GlassCard gradient>
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-yellow-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                <CheckCircle size={20} className="text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white font-medium">
                    <span className="text-yellow-300">{alert.studentName}</span> {alert.message}
                  </p>
                  <p className="text-blue-200 text-xs mt-1">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Premium Upsell */}
        <GlassCard gradient className="border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Zap size={40} className="text-yellow-400 animate-pulse" />
              <div>
                <h3 className="text-white text-lg font-bold">Upgrade to Premium</h3>
                <p className="text-blue-100 text-sm">AI Safety Analytics • Route History • Priority Support</p>
                <p className="text-yellow-300 font-bold mt-1">Only ₹99/month</p>
              </div>
            </div>
            <PremiumButton variant="gold" icon={Zap}>
              Upgrade Now
            </PremiumButton>
          </div>
        </GlassCard>

        {/* SOS Floating Button */}
        <button 
          onClick={() => setShowSOS(true)}
          className="fixed bottom-8 right-8 w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-2xl animate-pulse hover:scale-110 transition-transform z-50"
          style={{ boxShadow: '0 0 40px rgba(239, 68, 68, 0.6)' }}
        >
          <AlertTriangle size={32} className="text-white" />
        </button>

        {showSOS && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-6">
            <GlassCard gradient className="max-w-md w-full border-2 border-red-500">
              <div className="text-center">
                <AlertTriangle size={64} className="text-red-500 mx-auto mb-4 animate-pulse" />
                <h2 className="text-white text-2xl font-bold mb-2">Emergency SOS</h2>
                <p className="text-blue-100 mb-6">Alert school and admin immediately?</p>
                <div className="flex gap-4">
                  <PremiumButton variant="ghost" onClick={() => setShowSOS(false)} className="flex-1">
                    Cancel
                  </PremiumButton>
                  <PremiumButton variant="danger" icon={AlertTriangle} className="flex-1">
                    Send Alert
                  </PremiumButton>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
});

// ============= DRIVER DASHBOARD - PREMIUM =============
const DriverDashboard = memo(({ user }: { user: User }) => {
  const assignedBus = DEMO_DATA.buses[0];
  const route = DEMO_DATA.routes[0];
  const [students, setStudents] = useState(
    Array.from({ length: 40 }, (_, i) => ({
      id: `student_${i}`,
      name: `Student ${i + 1}`,
      stopName: route.stops[i % route.stops.length].name,
      status: i < 35 ? 'boarded' as const : 'not-boarded' as const
    }))
  );
  const [routeActive, setRouteActive] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const boardedCount = students.filter(s => s.status === 'boarded').length;

  const toggleAttendance = (studentId: string) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId 
        ? { ...s, status: s.status === 'boarded' ? 'not-boarded' as const : 'boarded' as const }
        : s
    ));
  };

  const handleSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Driver Dashboard
            </h1>
            <p className="text-white/80">{user.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{assignedBus.name}</p>
            <p className="text-green-300 text-sm">{route.name}</p>
          </div>
        </div>

        {/* Route Control */}
        <GlassCard gradient className="border-2 border-green-500/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-2xl font-bold">Route Status</h2>
              <p className={`text-lg font-semibold mt-1 ${routeActive ? 'text-green-300' : 'text-gray-400'}`}>
                {routeActive ? '● Live' : '○ Inactive'}
              </p>
            </div>
            <PremiumButton 
              variant={routeActive ? 'danger' : 'gold'}
              onClick={() => setRouteActive(!routeActive)}
              icon={routeActive ? Square : Play}
              className="min-w-[200px] h-16 text-lg"
            >
              {routeActive ? 'End Route' : 'Start Route'}
            </PremiumButton>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-500/20 rounded-xl text-center border border-blue-500/50">
              <Users size={32} className="mx-auto text-blue-300 mb-2" />
              <p className="text-3xl font-bold text-white">{boardedCount}/{assignedBus.capacity}</p>
              <p className="text-blue-200 text-sm">Students</p>
            </div>
            <div className="p-4 bg-green-500/20 rounded-xl text-center border border-green-500/50">
              <Navigation size={32} className="mx-auto text-green-300 mb-2" />
              <p className="text-3xl font-bold text-white">{assignedBus.speed.toFixed(0)}</p>
              <p className="text-green-200 text-sm">km/h</p>
            </div>
            <div className="p-4 bg-yellow-500/20 rounded-xl text-center border border-yellow-500/50">
              <Award size={32} className="mx-auto text-yellow-300 mb-2" />
              <p className="text-3xl font-bold text-white">On Time</p>
              <p className="text-yellow-200 text-sm">Status</p>
            </div>
          </div>
        </GlassCard>

        {/* SOS Button */}
        <GlassCard gradient className={`border-4 ${sosActive ? 'border-red-500 bg-red-500/30 animate-pulse' : 'border-red-500/50'}`}>
          <PremiumButton 
            variant="danger" 
            onClick={handleSOS}
            disabled={sosActive}
            className="w-full h-24 text-2xl"
            icon={AlertTriangle}
          >
            {sosActive ? 'EMERGENCY ALERT SENT!' : 'SOS EMERGENCY'}
          </PremiumButton>
          {sosActive && (
            <p className="text-center mt-4 text-red-300 font-semibold animate-pulse">
              Help dispatched! Admin and school notified with GPS location.
            </p>
          )}
        </GlassCard>

        {/* Attendance */}
        <GlassCard gradient>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <CheckCircle size={24} className="text-green-400" />
              Attendance ({boardedCount}/{assignedBus.capacity})
            </h2>
            <div className="flex gap-2">
              <PremiumButton 
                variant="ghost"
                onClick={() => setStudents(prev => prev.map(s => ({ ...s, status: 'boarded' as const })))}
                className="text-sm"
              >
                Mark All
              </PremiumButton>
              <PremiumButton 
                variant="gold"
                onClick={() => setShowAttendance(!showAttendance)}
                className="text-sm"
              >
                {showAttendance ? 'Hide' : 'Show'} List
              </PremiumButton>
            </div>
          </div>

          {showAttendance && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.map(student => (
                <div 
                  key={student.id}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                    student.status === 'boarded' 
                      ? 'bg-green-500/20 border-l-4 border-green-500' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => toggleAttendance(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <User size={32} className="text-white" />
                    <div>
                      <p className="text-white font-semibold">{student.name}</p>
                      <p className="text-blue-200 text-xs">{student.stopName}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    student.status === 'boarded' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {student.status === 'boarded' ? '✓ Boarded' : 'Not Boarded'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {assignedBus.speed > 35 && (
          <GlassCard gradient className="border-2 border-red-500 bg-red-500/20 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle size={40} className="text-red-400" />
              <div>
                <p className="text-white text-lg font-bold">Speed Alert!</p>
                <p className="text-red-200 text-sm">Current speed {assignedBus.speed.toFixed(1)} km/h exceeds safety limit</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
});

// ============= ADMIN DASHBOARD - PREMIUM =============
const AdminDashboard = memo(({ user }: { user: User }) => {
  const { buses } = useTracking();
  const [activeView, setActiveView] = useState<'overview' | 'fleet' | 'revenue'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Admin Control Center
            </h1>
            <p className="text-white/80">{user.name} - Go2School Kolkata</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm">Live Fleet</p>
            <p className="text-3xl font-bold text-white">{buses.length} Buses</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'fleet', label: 'Fleet', icon: Navigation },
            { id: 'revenue', label: 'Revenue', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeView === tab.id 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeView === 'overview' && (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <GlassCard gradient className="text-center border border-blue-500/50">
                <Users size={40} className="mx-auto text-blue-400 mb-3" />
                <p className="text-4xl font-bold text-white">625</p>
                <p className="text-blue-200 text-sm">Students</p>
                <p className="text-green-300 text-xs mt-1">↑ 15%</p>
              </GlassCard>
              
              <GlassCard gradient className="text-center border border-green-500/50">
                <Navigation size={40} className="mx-auto text-green-400 mb-3" />
                <p className="text-4xl font-bold text-white">{buses.length}</p>
                <p className="text-green-200 text-sm">Active Buses</p>
              </GlassCard>
              
              <GlassCard gradient className="text-center border border-purple-500/50">
                <TrendingUp size={40} className="mx-auto text-purple-400 mb-3" />
                <p className="text-4xl font-bold text-white">₹50L</p>
                <p className="text-purple-200 text-sm">Monthly Revenue</p>
                <p className="text-green-300 text-xs mt-1">↑ 22%</p>
              </GlassCard>
              
              <GlassCard gradient className="text-center border border-yellow-500/50">
                <Award size={40} className="mx-auto text-yellow-400 mb-3" />
                <p className="text-4xl font-bold text-white">82%</p>
                <p className="text-yellow-200 text-sm">Utilization</p>
              </GlassCard>
            </div>

            {/* Revenue Breakdown */}
            <GlassCard gradient>
              <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={24} className="text-purple-400" />
                Revenue Streams
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'Parent Subscriptions', amount: 4500000, percentage: 90, color: 'blue' },
                  { name: 'In-Bus Ads', amount: 400000, percentage: 8, color: 'yellow' },
                  { name: 'Premium Add-ons', amount: 100000, percentage: 2, color: 'purple' }
                ].map(stream => (
                  <div key={stream.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{stream.name}</span>
                      <span className="text-yellow-300 font-bold">₹{(stream.amount / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className={`bg-gradient-to-r from-${stream.color}-500 to-${stream.color}-600 h-3 rounded-full transition-all duration-1000`}
                        style={{ width: `${stream.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-bold">Total Monthly</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">₹50L</span>
                </div>
                <p className="text-blue-200 text-sm mt-2">Y1 Projection: ₹6 Cr • Target EBITDA: 20%</p>
              </div>
            </GlassCard>
          </>
        )}

        {activeView === 'fleet' && (
          <GlassCard gradient>
            <h2 className="text-white text-xl font-bold mb-4">Fleet Management</h2>
            <div className="space-y-3">
              {buses.map(bus => (
                <div key={bus.id} className="p-4 bg-white/10 rounded-xl flex items-center justify-between hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <BusIcon className="w-12 h-12" />
                    <div>
                      <p className="text-white font-bold">{bus.name}</p>
                      <p className="text-blue-200 text-sm">{bus.schoolBrand}</p>
                      <p className="text-blue-300 text-xs">
                        {bus.occupancy}/{bus.capacity} students • {bus.speed.toFixed(1)} km/h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      bus.status === 'on-route' ? 'bg-green-500/20 text-green-300 border border-green-500' : 
                      'bg-gray-500/20 text-gray-300 border border-gray-500'
                    }`}>
                      {bus.status === 'on-route' ? '● Active' : '○ Idle'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {activeView === 'revenue' && (
          <div className="grid grid-cols-2 gap-6">
            <GlassCard gradient className="border-2 border-green-500/50">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto text-green-400 mb-3" />
                <p className="text-white/60 text-sm">Today's Revenue</p>
                <p className="text-5xl font-bold text-white mt-2">₹1.6L</p>
                <p className="text-green-300 text-sm mt-2">↑ 12% vs yesterday</p>
              </div>
            </GlassCard>
            
            <GlassCard gradient className="border-2 border-purple-500/50">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto text-purple-400 mb-3" />
                <p className="text-white/60 text-sm">Monthly Target</p>
                <p className="text-5xl font-bold text-white mt-2">₹50L</p>
                <p className="text-purple-300 text-sm mt-2">83% achieved</p>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
});

// ============= ROLE SWITCHER =============
const RoleSwitcher = memo(({ currentRole, onSwitch }: { currentRole: string; onSwitch: (role: any) => void }) => (
  <div className="fixed top-6 right-6 z-50">
    <GlassCard gradient className="border-2 border-white/30">
      <p className="text-white text-xs font-semibold mb-3">Demo Mode: Switch Role</p>
      <div className="flex gap-2">
        {['parent', 'driver', 'admin'].map(role => (
          <button
            key={role}
            onClick={() => onSwitch(role)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              currentRole === role 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-blue-900 shadow-lg' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </GlassCard>
  </div>
));

// ============= MAIN APP =============
const Go2SchoolApp = () => {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  return (
    <div className="relative">
      <RoleSwitcher currentRole={user.role} onSwitch={switchRole} />
      
      {user.role === 'parent' && <ParentDashboard user={user} />}
      {user.role === 'driver' && <DriverDashboard user={user} />}
      {user.role === 'admin' && <AdminDashboard user={user} />}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};

export default Go2SchoolApp;