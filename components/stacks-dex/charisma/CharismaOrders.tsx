"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListOrdered } from "lucide-react";

// Charisma Order type from API
type CharismaOrder = {
  uuid: string;
  owner?: string;
  tokenIn?: string;
  tokenOut?: string;
  amountIn?: string;
  minAmountOut?: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
};

type CharismaOrdersResponse = {
  success: boolean;
  data: {
    status: string;
    data: CharismaOrder[];
  };
  error?: string;
  message?: string;
};

export interface CharismaOrdersProps {
  data: CharismaOrdersResponse;
  isLoading: boolean;
}

export default function CharismaOrders({ data, isLoading }: CharismaOrdersProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data || !data.data.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load Orders</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve Charisma orders"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const orders = data.data.data;

  return (
    <Card className="w-full bg-gradient-to-br from-purple-500/5 to-pink-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-lg">Charisma Limit Orders</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {orders.length} orders
          </Badge>
        </div>
        <CardDescription>
          Active and completed limit orders on Charisma DEX
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UUID</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead className="text-right">Amount In</TableHead>
                <TableHead className="text-right">Min Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.uuid}>
                    <TableCell>
                      <code className="text-xs text-zinc-400 font-mono">
                        {order.uuid.slice(0, 8)}...
                      </code>
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.tokenIn && order.tokenOut && (
                        <span className="text-white">
                          {order.tokenIn.split('.').pop()} → {order.tokenOut.split('.').pop()}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-purple-400">
                      {order.amountIn || '-'}
                    </TableCell>
                    <TableCell className="text-right text-green-400">
                      {order.minAmountOut || '-'}
                    </TableCell>
                    <TableCell>
                      {order.status && (
                        <Badge
                          variant={order.status === 'active' ? 'default' : 'secondary'}
                          className={order.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-500/20 text-zinc-400'}
                        >
                          {order.status}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data.message && (
          <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <p className="text-xs text-purple-300">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
