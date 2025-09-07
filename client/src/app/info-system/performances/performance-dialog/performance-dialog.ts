import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {IPerformanceDialogData} from '../../performance.config';
import {CommonModule} from '@angular/common';
import {map, Observable} from 'rxjs';
import {IActor} from '../../actor.config';
import {PerformancesApi} from '../../../services/performances-api';


@Component({
  selector: 'app-performance-dialog',
  standalone: true,
  imports: [MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ReactiveFormsModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './performance-dialog.html',
  styleUrl: './performance-dialog.scss'
})
export class PerformanceDialog implements OnInit{
  title: string
  buttonName: string;
  form: FormGroup;
  listOfYears: number[] = []
  actorList$!: Observable<IActor[]>

  constructor(
    private performanceApi: PerformancesApi,
    private dialogRef: MatDialogRef<PerformanceDialog>,
    @Inject(MAT_DIALOG_DATA) data: IPerformanceDialogData,
  ) {
    this.title = data.title
    this.buttonName = data.buttonName
    this.form = new FormGroup({
      name: new FormControl(data.form?.name ||'',
        [Validators.required,
          Validators.minLength(5),
          Validators.maxLength(255)]),
      year: new FormControl(data.form?.year || new Date().getFullYear()),
      budget: new FormControl( data.form?.budget || 0,
        [Validators.required,
          Validators.min(0)]),
      actors: new FormControl(data.form?.actors?.map(a => a._id) || [] // тепер масив id || []
      )
    })
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear()
    for (let i = currentYear; i >= 2020; i--) {
      this.listOfYears.push(i)
    }

    this.actorList$ = this.performanceApi.getAllActorsForPerformance().pipe(
      map( res => res.actors)
    )
  }

  public get performanceValidation() {
    return this.form.controls
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close(false)
  }
}
