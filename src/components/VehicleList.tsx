import { useState, useEffect, useCallback } from 'react';
import { Vehicle } from '@/data/mockVehicles';
import { VehicleCard } from './VehicleCard';
import { VehicleDetails } from './VehicleDetails';
import { VehicleEdit } from './VehicleEdit';
import { VehicleFilters } from './VehicleFilters';
import { vehicleApi, VehicleQuery } from '@/services/vehicleApi';
import { debounce } from '@/utils/debounce';
import { exportToCSV } from '@/utils/csvExport';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 8;

export const VehicleList = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lastSeen'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchVehicles = async (query: VehicleQuery) => {
    setLoading(true);
    setError(null);

    try {
      const response = await vehicleApi.getVehicles(query);
      setVehicles(response.vehicles);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedFetch = useCallback(
    debounce((query: VehicleQuery) => {
      fetchVehicles(query);
    }, 200),
    []
  );

  useEffect(() => {
    const query: VehicleQuery = {
      search: searchQuery,
      status: statusFilter,
      sortBy,
      sortOrder,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };

    if (searchQuery) {
      debouncedFetch(query);
    } else {
      fetchVehicles(query);
    }
  }, [searchQuery, statusFilter, sortBy, sortOrder, currentPage]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsOpen(true);
  };

  const handleEdit = () => {
    setDetailsOpen(false);
    setEditOpen(true);
  };

  const handleEditSuccess = () => {
    const query: VehicleQuery = {
      search: searchQuery,
      status: statusFilter,
      sortBy,
      sortOrder,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };
    fetchVehicles(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all vehicles with current filters (no pagination)
      const query: VehicleQuery = {
        search: searchQuery,
        status: statusFilter,
        sortBy,
        sortOrder,
        page: 1,
        limit: 1000, // Get all matching vehicles
      };
      
      const response = await vehicleApi.getVehicles(query);
      exportToCSV(response.vehicles);
      
      toast({
        title: 'Export Successful',
        description: `Exported ${response.vehicles.length} vehicles to CSV`,
      });
    } catch (err) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export vehicles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <VehicleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {/* Results info */}
      {!loading && (
        <div className="text-sm text-muted-foreground">
          Showing {vehicles.length} of {total} vehicles
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-28" />
              <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">No vehicles found</p>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Vehicle Grid */}
      {!loading && !error && vehicles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onClick={() => handleVehicleClick(vehicle)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 px-3"
              >
                <ChevronLeft className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              {/* Desktop pagination - show all pages */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => handlePageChange(page)}
                    className="w-9 h-9"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              {/* Mobile pagination - compact page indicator */}
              <div className="flex sm:hidden items-center gap-1.5 text-sm min-w-0">
                <span className="text-muted-foreground text-xs">Page</span>
                <span className="font-semibold">{currentPage}</span>
                <span className="text-muted-foreground text-xs">/</span>
                <span className="font-semibold">{totalPages}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 px-3"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 sm:ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <VehicleDetails
        vehicle={selectedVehicle}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onEdit={handleEdit}
      />

      <VehicleEdit
        vehicle={selectedVehicle}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};
