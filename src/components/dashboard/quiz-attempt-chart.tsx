"use client"

import * as React from "react"
import axios from "axios"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartConfig = {
  score: {
    label: "Score (%)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type Attempt = {
  _id: string
  userId: string
  lessonId: {
    _id: string
    title: string
  }
  score: number
  totalItems: number
  correctAnswers: number
  takenAt: string
}


type ChartEntry = {
  date: string
  score: number
}

function processAttemptsToChartData(attempts: Attempt[]): ChartEntry[] {
  return attempts.map((attempt) => ({
    date: attempt.takenAt,
    score: attempt.score, // already percentage-based
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function Component({ userId }: { userId: string }) {
  const [attempts, setAttempts] = React.useState<Attempt[]>([])
  const [timeRange, setTimeRange] = React.useState("90d")
  console.log(attempts)
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attempts/allattempts/${userId}`)
        setAttempts(res.data.attempts)
      } catch (error) {
        console.error("Failed to fetch attempts:", error)
      }
    }

    fetchData()
  }, [userId])

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date()
    startDate.setDate(referenceDate.getDate() - daysToSubtract)

    const recentAttempts = attempts.filter((a) => new Date(a.takenAt) >= startDate)

    return processAttemptsToChartData(recentAttempts)
  }, [attempts, timeRange])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Quiz Performance</CardTitle>
          <CardDescription>Attempts History</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select time range">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="score"
              type="natural"
              fill="url(#fillScore)"
              stroke="var(--color-score)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
