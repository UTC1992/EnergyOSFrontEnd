import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogActions} from "@angular/material";
import { FormBuilder,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-alerta-delete',
  templateUrl: './alerta-delete.component.html',
  styleUrls: ['./alerta-delete.component.css']
})
export class AlertaDeleteComponent implements OnInit {

	form: FormGroup;
    description:string;
    title: string;

    constructor(
        public fb: FormBuilder,
        public dialogRef: MatDialogRef<AlertaDeleteComponent>,
        @Inject(MAT_DIALOG_DATA) data) {

        this.title = data.title;
        this.description = data.description;
    }

    ngOnInit() {
    }

    aceptar() {
        this.dialogRef.close(true);
    }

    close() {
        this.dialogRef.close(false);
    }

}
