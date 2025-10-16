"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link2 } from "lucide-react";

// ALEX Token Mapping exact type based on API response from https://api.alexgo.io/v2/public/token-mappings
type AlexTokenMapping = {
  token: string; // ALEX wrapped token contract
  wrapped_token: string; // Original token contract
  token_decimals: number;
  wrapped_token_decimals: number;
  token_asset: string; // Short name like "wxusd"
  wrapped_token_asset: string; // Short name like "wrapped-usd"
};

type AlexTokenMappingsResponse = {
  success: boolean;
  data: {
    data: AlexTokenMapping[];
  };
  error?: string;
};

export interface AlexTokenMappingsProps {
  data: AlexTokenMappingsResponse;
  isLoading: boolean;
}

export default function AlexTokenMappings({ data, isLoading }: AlexTokenMappingsProps) {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.success || !data.data?.data) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Failed to Load ALEX Token Mappings</CardTitle>
          <CardDescription>{data.error || "Unable to retrieve ALEX token mapping information"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const mappings = data.data.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-orange-400" />
            <CardTitle className="text-lg">ALEX Token Mappings</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
            {mappings.length} mappings
          </Badge>
        </div>
        <CardDescription>Wrapped token to original token mappings</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ALEX Token</TableHead>
                <TableHead className="text-center">
                  <Link2 className="w-4 h-4 mx-auto" />
                </TableHead>
                <TableHead>Original Token</TableHead>
                <TableHead className="text-center">Decimals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No token mappings available
                  </TableCell>
                </TableRow>
              ) : (
                mappings.map((mapping, index) => {
                  return (
                    <TableRow key={`alex-mapping-${mapping.token}-${index}`}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-orange-400">
                            {mapping.token_asset.toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                            {mapping.token}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <div className="h-px w-4 bg-muted-foreground"></div>
                          <Link2 className="w-3 h-3 text-muted-foreground mx-1" />
                          <div className="h-px w-4 bg-muted-foreground"></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-blue-400">
                            {mapping.wrapped_token_asset.toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                            {mapping.wrapped_token}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {mapping.token_decimals}
                          </Badge>
                          <span className="text-muted-foreground">/</span>
                          <Badge variant="outline" className="text-xs">
                            {mapping.wrapped_token_decimals}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
