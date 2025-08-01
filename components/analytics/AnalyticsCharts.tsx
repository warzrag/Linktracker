'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsChartsProps {
  data: {
    summary: Array<{
      date: string
      clicks: number
      views: number
    }>
    stats: {
      topCountries: [string, number][]
      topDevices: [string, number][]
      topBrowsers: [string, number][]
      hourlyDistribution: Record<string, number>
    }
  }
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  console.log('AnalyticsCharts received data:', data)
  
  // Vérifier si les données existent
  if (!data || !data.summary || data.summary.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Évolution quotidienne</h3>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    )
  }
  
  // Prepare daily data - Filtrer seulement les jours avec des données
  const dailyData = data.summary
    .filter(item => item.clicks > 0 || item.views > 0) // Garder seulement les jours avec activité
    .slice(-7) // Prendre les 7 derniers jours
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      clicks: item.clicks || 0,
      views: item.views || 0
    }))
  
  console.log('Daily data for chart:', dailyData)
  
  // Si pas de données, utiliser les totaux sur les derniers jours
  if (dailyData.length === 0 && data.totalClicks > 0) {
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dailyData.push({
        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        clicks: i === 0 ? data.totalClicks : 0,
        views: i === 0 ? data.totalViews : 0
      })
    }
  }

  // Prepare hourly data
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}h`,
    clicks: data.stats.hourlyDistribution[hour] || 0
  }))

  // Prepare device data
  const deviceData = data.stats.topDevices.map(([device, count]) => ({
    name: device,
    value: count
  }))

  // Prepare country data
  const countryData = data.stats.topCountries.map(([country, count]) => ({
    name: country,
    clicks: count
  }))

  return (
    <div className="space-y-6">
      {/* Daily Clicks and Views */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Évolution quotidienne</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Clics"
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Vues"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribution horaire</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Appareils</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Pays les plus actifs</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="clicks" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}