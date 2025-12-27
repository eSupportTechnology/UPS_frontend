import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Ticket } from '../types/ticket.types';

export interface TicketExportData {
    ticket: Ticket;
    includePhotos?: boolean;
}

/**
 * Generate PDF from ticket details
 * Production-level implementation with proper formatting
 */
export const generateTicketPDF = async (data: TicketExportData): Promise<void> => {
    try {
        const { ticket, includePhotos = false } = data;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let currentY = 15;
        const margin = 15;
        const contentWidth = pageWidth - margin * 2;

        // Header
        pdf.setFontSize(20);
        pdf.setTextColor(33, 150, 243); // Primary color
        pdf.text('TICKET DETAILS', margin, currentY);
        currentY += 12;

        // Divider line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;

        // Ticket ID and Basic Info
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);

        const labelItem = (label: string, value: any) => {
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${label}:`, margin, currentY);
            pdf.setFont('helvetica', 'normal');
            const labelWidth = pdf.getTextWidth(`${label}: `);
            pdf.text(`${value || '-'}`, margin + labelWidth, currentY);
            currentY += 7;
        };

        // Basic Information
        labelItem('Ticket ID', ticket.id);
        labelItem('Status', ticket.status?.toUpperCase() || '-');
        labelItem('Priority', ticket.priority?.toUpperCase() || '-');
        labelItem('Title', ticket.title);

        // Description
        pdf.setFont('helvetica', 'bold');
        pdf.text('Description:', margin, currentY);
        currentY += 5;
        pdf.setFont('helvetica', 'normal');
        const descriptionLines = pdf.splitTextToSize(ticket.description || '-', contentWidth);
        pdf.text(descriptionLines, margin, currentY);
        currentY += descriptionLines.length * 5 + 5;

        // Customer Information Section
        pdf.setFontSize(13);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Customer Information', margin, currentY);
        currentY += 2;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;

        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        const addLabel = (label: string, value: any) => {
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${label}:`, margin, currentY);
            pdf.setFont('helvetica', 'normal');
            const labelWidth = pdf.getTextWidth(`${label}: `);
            pdf.text(`${value || '-'}`, margin + labelWidth, currentY);
            currentY += 7;
        };

        addLabel('Customer Name', ticket.customer_name);
        addLabel('Email', ticket.customer_email);
        addLabel('Phone', ticket.customer_phone);
        addLabel('Type', ticket.customer_type?.toUpperCase() || '-');

        // Location Information
        pdf.setFontSize(13);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Location Information', margin, currentY);
        currentY += 2;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;

        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);

        const formatLabel = (label: string, value: any) => {
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${label}:`, margin, currentY);
            pdf.setFont('helvetica', 'normal');
            const labelWidth = pdf.getTextWidth(`${label}: `);
            pdf.text(`${value || '-'}`, margin + labelWidth, currentY);
            currentY += 7;
        };

        if (ticket.customer_type === 'company') {
            formatLabel('Branch Location', ticket.branch_name || '-');
            formatLabel('Branch Type', ticket.is_primary ? 'Headquarters' : 'Branch');
            if (ticket.address) {
                formatLabel('Site Address', ticket.address);
            }
        } else {
            formatLabel('Address', ticket.address || '-');
        }

        // Technician Information
        if (ticket.technician_name) {
            currentY += 3;
            pdf.setFontSize(13);
            pdf.setTextColor(33, 150, 243);
            pdf.text('Assigned Technician', margin, currentY);
            currentY += 2;
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, currentY, pageWidth - margin, currentY);
            currentY += 8;

            pdf.setFontSize(11);
            pdf.setTextColor(0, 0, 0);
            formatLabel('Name', ticket.technician_name);
            formatLabel('Email', ticket.technician_email);
            formatLabel('Phone', ticket.technician_phone);
        }

        // Timeline
        currentY += 3;
        pdf.setFontSize(13);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Timeline', margin, currentY);
        currentY += 2;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;

        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        formatLabel('Created', formatDate(ticket.created_at));
        if (ticket.accepted_at) {
            formatLabel('Accepted', formatDate(ticket.accepted_at));
        }
        if (ticket.completed_at) {
            formatLabel('Completed', formatDate(ticket.completed_at));
        }

        // Add page number
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(9);
            pdf.setTextColor(150, 150, 150);
            pdf.text(
                `Page ${i} of ${pageCount}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        pdf.save(`ticket-${ticket.id}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
};

/**
 * Generate CSV from ticket details
 * Production-level implementation with proper formatting
 */
export const generateTicketCSV = (ticket: Ticket): void => {
    try {
        const csvData: Record<string, string> = {
            'Ticket ID': ticket.id,
            'Status': ticket.status || '-',
            'Priority': ticket.priority || '-',
            'Title': ticket.title,
            'Description': ticket.description,
            'Customer Name': ticket.customer_name || '-',
            'Customer Email': ticket.customer_email || '-',
            'Customer Phone': ticket.customer_phone || '-',
            'Customer Type': ticket.customer_type || '-',
            'Address': ticket.address || '-',
            'Branch Name': ticket.branch_name || '-',
            'Branch Type': ticket.is_primary ? 'Headquarters' : 'Branch',
            'Technician Name': ticket.technician_name || '-',
            'Technician Email': ticket.technician_email || '-',
            'Technician Phone': ticket.technician_phone || '-',
            'Created Date': formatDate(ticket.created_at),
            'Accepted Date': ticket.accepted_at ? formatDate(ticket.accepted_at) : '-',
            'Completed Date': ticket.completed_at ? formatDate(ticket.completed_at) : '-',
        };

        // Convert to CSV string
        const headers = Object.keys(csvData);
        const values = Object.values(csvData).map(escapeCSVValue);
        const csvContent = [
            headers.map(escapeCSVValue).join(','),
            values.join(','),
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `ticket-${ticket.id}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating CSV:', error);
        throw new Error('Failed to generate CSV');
    }
};

/**
 * Generate detailed CSV with all information (Multi-line format)
 */
export const generateDetailedTicketCSV = (ticket: Ticket): void => {
    try {
        const rows = [
            ['TICKET DETAILS'],
            [],
            ['Field', 'Value'],
            ['Ticket ID', ticket.id],
            ['Status', ticket.status || '-'],
            ['Priority', ticket.priority || '-'],
            ['Title', ticket.title],
            ['Description', ticket.description],
            [],
            ['CUSTOMER INFORMATION'],
            ['Customer Name', ticket.customer_name || '-'],
            ['Customer Email', ticket.customer_email || '-'],
            ['Customer Phone', ticket.customer_phone || '-'],
            ['Customer Type', ticket.customer_type || '-'],
            [],
            ['LOCATION INFORMATION'],
            ['Address', ticket.address || '-'],
            ...(ticket.branch_name ? [['Branch Location', ticket.branch_name]] : []),
            ...(ticket.is_primary ? [['Branch Type', 'Headquarters']] : [['Branch Type', 'Branch']]),
            [],
            ...(ticket.technician_name
                ? [
                    ['TECHNICIAN INFORMATION'],
                    ['Technician Name', ticket.technician_name],
                    ['Technician Email', ticket.technician_email || '-'],
                    ['Technician Phone', ticket.technician_phone || '-'],
                    [],
                ]
                : []),
            ['TIMELINE'],
            ['Created Date', formatDate(ticket.created_at)],
            ...(ticket.accepted_at ? [['Accepted Date', formatDate(ticket.accepted_at)]] : []),
            ...(ticket.completed_at ? [['Completed Date', formatDate(ticket.completed_at)]] : []),
        ];

        const csvContent = rows
            .map((row) => row.map(escapeCSVValue).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `ticket-${ticket.id}-detailed-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating detailed CSV:', error);
        throw new Error('Failed to generate detailed CSV');
    }
};

/**
 * Helper function to format date
 */
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateString;
    }
};

/**
 * Helper function to escape CSV values
 */
const escapeCSVValue = (value: string): string => {
    if (!value) return '""';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
};

/**
 * Generate Excel-style CSV for multiple tickets with summary
 */
export const generateBulkTicketCSV = (tickets: Ticket[]): void => {
    try {
        const rows: string[][] = [
            ['TICKET EXPORT REPORT'],
            [`Generated: ${new Date().toLocaleString()}`],
            [`Total Tickets: ${tickets.length}`],
            [],
            ['SUMMARY STATISTICS'],
            ['Metric', 'Count', 'Percentage'],
            ['Total', tickets.length.toString(), '100%'],
            ['Personal Customers', tickets.filter(t => t.customer_type === 'personal').length.toString(), ((tickets.filter(t => t.customer_type === 'personal').length / tickets.length) * 100).toFixed(1) + '%'],
            ['Company Customers', tickets.filter(t => t.customer_type === 'company').length.toString(), ((tickets.filter(t => t.customer_type === 'company').length / tickets.length) * 100).toFixed(1) + '%'],
            [],
            ['STATUS BREAKDOWN'],
            ...Object.entries(getStatusCounts(tickets)).map(([status, count]) => [status, count.toString()]),
            [],
            ['PRIORITY BREAKDOWN'],
            ...Object.entries(getPriorityCounts(tickets)).map(([priority, count]) => [priority, count.toString()]),
            [],
            ['DETAILED TICKET LIST'],
            ['ID', 'Title', 'Customer', 'Type', 'Status', 'Priority', 'Created', 'Branch/Address'],
            ...tickets.map(t => [
                t.id,
                t.title || '-',
                t.customer_name || '-',
                (t.customer_type || '-').toUpperCase(),
                (t.status || 'Open').toUpperCase(),
                (t.priority || 'Medium').toUpperCase(),
                formatDate(t.created_at),
                t.customer_type === 'company' ? (t.branch_name || '-') : (t.address || '-'),
            ]),
        ];

        const csvContent = rows
            .map((row) => row.map(escapeCSVValue).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `tickets-bulk-export-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating bulk ticket CSV:', error);
        throw new Error('Failed to generate bulk ticket CSV');
    }
};

/**
 * Generate Summary Report PDF for multiple tickets
 */
export const generateBulkTicketPDF = (tickets: Ticket[]): void => {
    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let currentY = 15;
        const margin = 15;
        const contentWidth = pageWidth - margin * 2;

        // Header
        pdf.setFontSize(24);
        pdf.setTextColor(33, 150, 243);
        pdf.text('TICKET EXPORT REPORT', margin, currentY);
        currentY += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, currentY);
        currentY += 10;

        // Summary Statistics Section
        pdf.setFontSize(14);
        pdf.setTextColor(33, 150, 243);
        pdf.text('SUMMARY STATISTICS', margin, currentY);
        currentY += 2;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;

        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);

        const addStatRow = (label: string, value: string) => {
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${label}:`, margin, currentY);
            pdf.setFont('helvetica', 'normal');
            pdf.text(value, margin + 60, currentY);
            currentY += 7;
        };

        addStatRow('Total Tickets', tickets.length.toString());
        addStatRow('Personal Customers', tickets.filter(t => t.customer_type === 'personal').length.toString());
        addStatRow('Company Customers', tickets.filter(t => t.customer_type === 'company').length.toString());

        currentY += 5;

        // Status Breakdown
        pdf.setFontSize(12);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Status Breakdown', margin, currentY);
        currentY += 5;

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        const statusCounts = getStatusCounts(tickets);
        Object.entries(statusCounts).forEach(([status, count]) => {
            pdf.text(`${status}: ${count}`, margin + 5, currentY);
            currentY += 5;
        });

        currentY += 5;

        // Priority Breakdown
        pdf.setFontSize(12);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Priority Breakdown', margin, currentY);
        currentY += 5;

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        const priorityCounts = getPriorityCounts(tickets);
        Object.entries(priorityCounts).forEach(([priority, count]) => {
            pdf.text(`${priority}: ${count}`, margin + 5, currentY);
            currentY += 5;
        });

        // Add page number
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(9);
            pdf.setTextColor(150, 150, 150);
            pdf.text(
                `Page ${i} of ${pageCount}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        pdf.save(`tickets-bulk-export-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error('Error generating bulk PDF:', error);
        throw new Error('Failed to generate bulk ticket PDF');
    }
};

/**
 * Generate filtered tickets report by date range
 */
export const generateDateRangeTicketsCSV = (tickets: Ticket[], fromDate: Date, toDate: Date): void => {
    try {
        const filtered = tickets.filter(t => {
            const createdDate = new Date(t.created_at);
            return createdDate >= fromDate && createdDate <= toDate;
        });

        const rows: string[][] = [
            ['TICKET REPORT - DATE RANGE'],
            [`From: ${fromDate.toLocaleDateString()} To: ${toDate.toLocaleDateString()}`],
            [`Total Tickets: ${filtered.length}`],
            [],
            ['ID', 'Title', 'Customer', 'Type', 'Status', 'Priority', 'Created', 'Completed'],
            ...filtered.map(t => [
                t.id,
                t.title || '-',
                t.customer_name || '-',
                (t.customer_type || '-').toUpperCase(),
                (t.status || 'Open').toUpperCase(),
                (t.priority || 'Medium').toUpperCase(),
                formatDate(t.created_at),
                t.completed_at ? formatDate(t.completed_at) : '-',
            ]),
        ];

        const csvContent = rows
            .map((row) => row.map(escapeCSVValue).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `tickets-range-${fromDate.toISOString().split('T')[0]}-to-${toDate.toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating date range CSV:', error);
        throw new Error('Failed to generate date range CSV');
    }
};

/**
 * Generate filtered report by type (personal/company)
 */
export const generateTypeWiseTicketsCSV = (tickets: Ticket[], type: 'personal' | 'company'): void => {
    try {
        const filtered = tickets.filter(t => t.customer_type === type);

        const rows: string[][] = [
            [`TICKET REPORT - ${type.toUpperCase()} CUSTOMERS`],
            [`Total Tickets: ${filtered.length}`],
            [],
            ['ID', 'Title', 'Customer', 'Status', 'Priority', 'Created', type === 'company' ? 'Branch' : 'Address'],
            ...filtered.map(t => [
                t.id,
                t.title || '-',
                t.customer_name || '-',
                (t.status || 'Open').toUpperCase(),
                (t.priority || 'Medium').toUpperCase(),
                formatDate(t.created_at),
                type === 'company' ? (t.branch_name || '-') : (t.address || '-'),
            ]),
        ];

        const csvContent = rows
            .map((row) => row.map(escapeCSVValue).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `tickets-${type}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating type-wise CSV:', error);
        throw new Error('Failed to generate type-wise CSV');
    }
};

/**
 * Generate filtered report by status
 */
export const generateStatusWiseTicketsCSV = (tickets: Ticket[], status: string): void => {
    try {
        const filtered = tickets.filter(t => (t.status || 'open').toLowerCase() === status.toLowerCase());

        const rows: string[][] = [
            [`TICKET REPORT - ${status.toUpperCase()} STATUS`],
            [`Total Tickets: ${filtered.length}`],
            [],
            ['ID', 'Title', 'Customer', 'Type', 'Priority', 'Created', 'Completed'],
            ...filtered.map(t => [
                t.id,
                t.title || '-',
                t.customer_name || '-',
                (t.customer_type || '-').toUpperCase(),
                (t.priority || 'Medium').toUpperCase(),
                formatDate(t.created_at),
                t.completed_at ? formatDate(t.completed_at) : '-',
            ]),
        ];

        const csvContent = rows
            .map((row) => row.map(escapeCSVValue).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `tickets-${status}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating status-wise CSV:', error);
        throw new Error('Failed to generate status-wise CSV');
    }
};

/**
 * Generate filtered report by priority
 */
export const generatePriorityWiseTicketsCSV = (tickets: Ticket[], priority: string): void => {
    try {
        const filtered = tickets.filter(t => (t.priority || 'medium').toLowerCase() === priority.toLowerCase());

        const rows: string[][] = [
            [`TICKET REPORT - ${priority.toUpperCase()} PRIORITY`],
            [`Total Tickets: ${filtered.length}`],
            [],
            ['ID', 'Title', 'Customer', 'Type', 'Status', 'Created', 'Completed'],
            ...filtered.map(t => [
                t.id,
                t.title || '-',
                t.customer_name || '-',
                (t.customer_type || '-').toUpperCase(),
                (t.status || 'Open').toUpperCase(),
                formatDate(t.created_at),
                t.completed_at ? formatDate(t.completed_at) : '-',
            ]),
        ];

        const csvContent = rows
            .map((row) => row.map(escapeCSVValue).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `tickets-${priority}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating priority-wise CSV:', error);
        throw new Error('Failed to generate priority-wise CSV');
    }
};

/**
 * Helper function to get status counts
 */
const getStatusCounts = (tickets: Ticket[]): Record<string, number> => {
    return tickets.reduce((acc, ticket) => {
        const status = (ticket.status || 'Open').toUpperCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};

/**
 * Helper function to get priority counts
 */
const getPriorityCounts = (tickets: Ticket[]): Record<string, number> => {
    return tickets.reduce((acc, ticket) => {
        const priority = (ticket.priority || 'Medium').toUpperCase();
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};
