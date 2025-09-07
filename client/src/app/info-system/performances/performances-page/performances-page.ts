import {Component, OnInit, ViewChild} from '@angular/core';
import {PerformancesApi} from '../../../services/performances-api';
import {BehaviorSubject, map, Observable, of, tap} from 'rxjs';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {CommonModule} from '@angular/common';
import {IPerformance} from '../../performance.config';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {PerformanceDialog} from '../performance-dialog/performance-dialog';
import {ConfirmDialog} from '../../confirm-dialog/confirm-dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthApi} from '../../../services/auth-api';
import {LoadingSpinner} from '../../loading-spinner/loading-spinner';

@Component({
  selector: 'app-performances-page',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, FormsModule, MatDialogModule, LoadingSpinner],
  templateUrl: './performances-page.html',
  styleUrls: ['./performances-page.scss', '../../actors/actors-list/actors-list.scss']
})
export class PerformancesPage implements OnInit{
  performanceList$ = new BehaviorSubject<IPerformance[]>([]);
  year: number = 2025
  currentPage: number = 1
  limit: number = 10
  totalPages = 0
  total = 0
  listOfYears: number[] = []
  loading = true
  @ViewChild(MatPaginator) paginator! : MatPaginator

  constructor(
    private snackBar: MatSnackBar,
    private performanceApi: PerformancesApi,
    private dialog: MatDialog,
    public authApi: AuthApi
    ) {}

  getAllPerformancesByYear(page: number = 1, year: number = 2025) {
    this.currentPage = page
    this.year = year
    this.performanceApi.getAllPerformances(this.currentPage, this.limit, this.year).subscribe(
      res => {
        this.performanceList$.next(res.performances)
        this.totalPages = res.totalPage
        this.currentPage = res.page
        this.total = res.total
        if (this.paginator) {
          this.paginator.length = res.total
        }
        this.loading = false
      })
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear()
    for (let i = currentYear; i >= 2020; i--) {
      this.listOfYears.push(i)
    }

    this.getAllPerformancesByYear()
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1
    this.limit = event.pageSize
    this.getAllPerformancesByYear(this.currentPage, this.year)
  }

  onYearChange(year: number) : void {
    this.currentPage = 1
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getAllPerformancesByYear(1, +year)
  }

  createPerformanceDialog() :void {
    const dialogRef = this.dialog.open(PerformanceDialog,  {
      data: { title : "Create performance", buttonName: 'Create' }
    })
    dialogRef.afterClosed().subscribe( result => {
      if (result) {

        this.performanceApi.createPerformance(result).subscribe({
          next: () => {
            this.getAllPerformancesByYear(this.currentPage, this.year);
            this.snackBar.open('Performance created successfully',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['custom-snackbar']
              });
          },
          error: err => console.error('Error creating performance:', err)
        })
      }
    })
  }

  updatePerformanceDialog(id: string, performance: IPerformance) {
    const dialogRef = this.dialog.open(PerformanceDialog, {
      data: { title: 'Update performance', buttonName: 'Update', form: performance}
    })
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        console.log(result)
        this.performanceApi.updatePerformance(id, result).subscribe({
          next: () => {

            this.getAllPerformancesByYear(this.currentPage, this.year);
            this.snackBar.open('Performance updated successfully',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['custom-snackbar']
              });
          },
          error: err => console.error('Error creating performance:', err)
        })
      }
    })
  }

  deletePerformanceDialog(id: string | null | undefined, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { title: "Confirmation", description: `Are you sure you want to delete ${name} performance?`}
    })
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.performanceApi.deletePerformance(id).subscribe({
          next: () => {
            this.getAllPerformancesByYear(this.currentPage, this.year);
            this.snackBar.open('Performance deleted successfully',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['custom-snackbar']
              });
          }
        })
      }
    })
  }

}
