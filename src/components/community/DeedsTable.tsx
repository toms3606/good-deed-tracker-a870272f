
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Deed } from '@/types/deed';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

interface DeedsTableProps {
  deeds: Deed[];
  statusFilter: 'all' | 'completed' | 'pending';
}

const DeedsTable: React.FC<DeedsTableProps> = ({ deeds, statusFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeeds, setFilteredDeeds] = useState<Deed[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter deeds when search query or status filter changes
  useEffect(() => {
    let filtered = deeds.filter(deed => 
      deed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deed.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deed.impact.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(deed => 
        statusFilter === 'completed' ? deed.completed : !deed.completed
      );
    }
    
    setFilteredDeeds(filtered);
    setCurrentPage(1);
  }, [searchQuery, deeds, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredDeeds.length / itemsPerPage);
  const currentDeeds = filteredDeeds.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  const getImpactBadgeClass = (impact: string) => {
    switch (impact) {
      case 'small':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'large':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return '';
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Community Good Deeds</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deeds..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Impact Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDeeds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    {deeds.length === 0 ? "No good deeds recorded yet." : "No deeds match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                currentDeeds.map((deed) => (
                  <TableRow key={deed.id}>
                    <TableCell className="font-medium">{deed.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{deed.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getImpactBadgeClass(deed.impact)}>
                        {deed.impact}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={deed.completed ? "default" : "secondary"}>
                        {deed.completed ? "Completed" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
                
                return (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

export default DeedsTable;
