import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {IContract, IContractDialogData} from '../../contract.config';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {IActor} from '../../actor.config';
import {ContractsApi} from '../../../services/contracts-api';
import {IPerformance} from '../../performance.config';
import {PerformancesApi} from '../../../services/performances-api';

@Component({
  selector: 'app-contracts-dialog',
  standalone: true,
  imports: [MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule],
  templateUrl: './contracts-dialog.html',
  styleUrls: ['./contracts-dialog.scss', '../../performances/performance-dialog/performance-dialog.scss']
})
export class ContractsDialog implements OnInit{
  title: string
  buttonName: string;
  form: FormGroup;
  actorId: string;
  performanceList$!: Observable<IPerformance[]>

  constructor(
    private dialogRef: MatDialogRef<ContractsDialog>,
    private performanceApi: PerformancesApi,
    @Inject(MAT_DIALOG_DATA) data: IContractDialogData,
  ) {

    this.title = data.title
    this.buttonName = data.buttonName
    this.actorId = data.actor
    this.form = new FormGroup({
      performance: new FormControl(data.form?.performance ||'',
        [Validators.required]),
      role: new FormControl(data.form?.role || '',
        [Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]),
      salary: new FormControl( data.form?.salary || 0,
        [Validators.required])
    })
  }

  ngOnInit() {
    this.performanceList$ = this.performanceApi.getAllPerformanceNames()
    console.log(this.performanceList$)
  }

  public get contractValidation() {
    return this.form.controls
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close({actor: this.actorId, ...this.form.value});
    }
  }

  close() {
    this.dialogRef.close(false)
  }
}
