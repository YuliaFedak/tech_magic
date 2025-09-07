import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IActor } from '../../actor.config';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {ActorsApi} from '../../../services/actors-api';
import {Router} from '@angular/router';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {ConfirmDialog} from '../../confirm-dialog/confirm-dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {LoadingSpinner} from '../../loading-spinner/loading-spinner';


@Component({
  selector: 'app-actors-list',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatDialogModule, MatSnackBarModule, LoadingSpinner],
  templateUrl: './actors-list.html',
  styleUrls: ['./actors-list.scss']
})
export class ActorsList implements OnInit{
  actorList$ = new BehaviorSubject<IActor[] | null>(null);
  currentPage: number = 1
  limit: number = 10
  totalPages = 0
  total = 0
  loading = true
  @ViewChild(MatPaginator) paginator! : MatPaginator

  constructor(
    private actorsApi: ActorsApi,
    private router: Router,
    private dialog: MatDialog,
    private snackBar:MatSnackBar) {}

  public getActors(page: number = 1) {
    this.currentPage = page
    this.actorsApi.getAllActors(this.currentPage, this.limit).subscribe({
      next: (res) => {
        this.totalPages = res.totalPage;
        this.currentPage = res.page;
        this.total = res.total;
        this.actorList$.next(res.actors);
        this.loading = false;
        console.log(this.loading)
      },
      error: (err) => {
        console.error(err);
        this.actorList$.next([])
        this.loading = false;
      }
    })


  }
  ngOnInit() {
    this.getActors()
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1
    this.limit = event.pageSize
    this.getActors(this.currentPage)
  }


  public navigateToUpdate(id: string | null | undefined) {
    if (!id) return;
    this.router.navigate(['actors', 'edit', id])
  }

  public navigateToContracts(actorId: string | null | undefined) {
    this.router.navigate([`actors/${actorId}/contracts` ])
  }

   deleteActor(id: string | null | undefined, last_name: string, first_name: string, middle_name: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { title: "Confirmation", description: `Are you sure you want to delete ${last_name} ${first_name} ${middle_name}?`}
    })

     dialogRef.afterClosed().subscribe(result => {
       if (result) {
         this.actorsApi.deleteActor(id).subscribe({
           next: () => {
             if (this.total - 1 <= (this.currentPage - 1) * this.limit) {
               this.currentPage = this.currentPage - 1 > 0 ? this.currentPage - 1 : 1;
             }
             this.getActors(this.currentPage);
             this.snackBar.open('Actor deleted successfully',
               'Close',
               {
                 duration: 3000,
                 horizontalPosition: 'right',
                 verticalPosition: 'top',
                 panelClass: ['custom-snackbar']
               });
           },
           error: (err) => {
             console.error('Error deleting actor:', err);
           }
         })
       }
     })
  }

}
