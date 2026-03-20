import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario';
import { BackendService } from 'src/app/services/backend.service';
interface HtmlInputEvent extends Event{
  target: HtmlInputEvent & EventTarget;
}
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  formGroups: FormGroup = new FormGroup({});
  userControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  listado1 = new Array<Usuario>();
  url: any;
	msg = '';
  imgUrl= "";

  constructor(private fb: FormBuilder,private router:Router, private backend:BackendService,public snackBar: MatSnackBar) {
    this.formGroups = this.fb.group({
      id:['', [Validators.required]],
      usuario: ['', [Validators.required]],
      nombre:['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      sexo:['', [Validators.required]],
      correo: ['', [Validators.required]],
      contrase:['', [Validators.required]],
      imagen: [null, [Validators.required]],
      descripcion:['', [Validators.required]]
    })
  }
  guardarUsuario() {
      const formData = new FormData();
      formData.append('imagen', this.msg);
      const fecha = new Date(this.formGroups.value.edad);
      const fechaArr = fecha.toISOString().split('T')[0];
      formData.append('edad',fechaArr);
      this.backend.guardarUsuarioConImagen(formData, this.formGroups.value).subscribe((response) => {
          console.log('FormGroup Value:', this.formGroups.value);
          if(this.formGroups.controls['usuario'].value != '' && this.formGroups.controls['nombre'].value!= ''&&
          this.formGroups.controls['apellido'].value != ''&&this.formGroups.controls['edad'].value!= ''&&
          this.formGroups.controls['sexo'].value!= ''&&this.formGroups.controls['correo'].value!= ''
          &&this.formGroups.controls['contrase'].value!= ''&&this.formGroups.controls['imagen'].value!= ''
          &&this.formGroups.controls['descripcion'].value!= ''){
            this.snackBar.open('¡Registrado con éxito! 🎉🌟😊', 'Undo', {
              duration: 4000,
            });
            this.borraringreso();
            window.location.reload();
          }else{
            this.snackBar.open('Por favor, complete todos los campos correctamente.', 'Undo', {
              duration: 4000,
            });
          }
      });
    }
  borraringreso(){
    this.formGroups.reset();
    this.router.navigateByUrl("/");
  }
  imagenSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any)=>{
        this.imgUrl = event.target.result;
      }
      this.msg = file;
      ;
    } else {
      console.error('No se seleccionó ningún archivo');
    }
  }
}
