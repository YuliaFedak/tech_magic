import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IContract} from '../../contract.config';
import {ContractsApi} from '../../../services/contracts-api';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {ContractsDialog} from '../contracts-dialog/contracts-dialog';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ConfirmDialog} from '../../confirm-dialog/confirm-dialog';
import {AuthApi} from '../../../services/auth-api';
import {LoadingSpinner} from '../../loading-spinner/loading-spinner';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, LoadingSpinner],
  templateUrl: './contracts-page.html',
  styleUrls: ['./contracts-page.scss', "../../actors/actors-list/actors-list.scss"]
})
export class ContractsPage implements OnInit{
  actorId: string | null = null;
  contractsList$ = new BehaviorSubject<IContract[] | null>(null)
  loading = true

  constructor(
    private snackBar: MatSnackBar,
    private contractApi: ContractsApi,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public authApi: AuthApi
  ) {}



  ngOnInit() {
    console.log(this.loading)
    this.actorId = this.route.snapshot.paramMap.get('id')
    this.getAllActorContracts()
  }

  public getAllActorContracts() {
    if (this.actorId) {
      this.contractApi.getAllPerformanceByActorId(this.actorId).subscribe({
        next: (contracts) => {
          this.contractsList$.next(contracts)
          this.loading = false
        },
        error: (err) => {
          console.error('Error loading contracts:', err)
          this.loading = false
        }
      })
    }
  }

  get totalSalary(): number {
    const contracts = this.contractsList$.value
    if (!contracts) {
      return 0
    }
    return contracts.reduce((sum, value) => sum + value.salary, 0)
  }

  get bonus(): string {
    const contracts = this.contractsList$.value
    if (contracts && contracts?.length >= 10) {
      return "Award a bonus"
    } else {
      return  'Without bonus'
    }
  }

  createContractDialog() :void {
    const dialogRef = this.dialog.open(ContractsDialog, {
      data: {title: "Create contract", buttonName: 'Create', actor: this.actorId}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.contractApi.createContract(result).subscribe({
          next: () => {
            this.getAllActorContracts()
            this.snackBar.open('Contract created successfully',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['custom-snackbar']
              });
          },
          error: (err) => {
            console.error('Error creating contract:', err)
          }
        })
      }
    })
  }

  updateContactDialog(contractId: string, contract: IContract) : void {
    const form = {
      ...contract,
      performance: contract.performance._id
    }

    const dialogRef = this.dialog.open(ContractsDialog, {
      data: {title: "Update contract", buttonName: 'Update', actor: this.actorId, form: form}
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.contractApi.updateContact(contractId, result).subscribe({
          next: () => {
            this.getAllActorContracts()
            this.snackBar.open('Contract updated successfully',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['custom-snackbar']
              });
          },
          error: (err) => {
            console.error('Error creating contract:', err)
          }
        })
      }
    })
  }

  deleteContractDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { title: "Confirmation", description: `Are you sure you want to delete this contract?`}
    })
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.contractApi.deleteContract(id).subscribe({
          next: () => {
            this.getAllActorContracts();
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
