import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/Services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  studentId: string | null | undefined;
  student: Student = {
    id:'',
    firstName:'',
    lastName:'',
    dateOfBirth:'',
    email:'',
    mobile:0,
    genderId:'',
    profileImageUrl:'',
    gender:{
      genderId:'',
      description:''
    },
    address:{
      id:'',
      physicalAddress:'',
      postalAddress:''
    },
  };
  isNewStudent = false;
  header = '';

  genderList: Gender[] = [];
  constructor(private readonly studentService: StudentService
    ,private readonly route: ActivatedRoute
    ,private readonly genderService: GenderService
    ,private snackbar: MatSnackBar
    ,private router: Router
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if(this.studentId){

          if(this.studentId.toLowerCase() === 'Add'.toLowerCase()){
            this.isNewStudent = true;
            this.header = 'Add New Student';
          }
          else{
            this.isNewStudent = false;
            this.header = 'Edit Student';
            this.studentService.getStudent(this.studentId)
          .subscribe(
            (successResponse) => {
              this.student = successResponse;
            }
          );
          }
          
          this.genderService.getGenderList()
          .subscribe(
            (successResponse)=>{
              //console.log(successResponse);
              this.genderList = successResponse;
            });
        }
      });
  }

  onUpdate(): void{
    //call student service to update student details
    this.studentService.updateStudent(this.student.id,this.student)
    .subscribe(
      (successResponse)=>{
        //console.log(successResponse);
        //show a notification
        this.snackbar.open('Student updated successfully!', undefined,{
          duration:2000
        });
      },
      (error) => {
        //log it
        console.log(error);
      })
  }

  //student service to delete
  onDelete():void{

    this.studentService.deleteStudent(this.student.id)
    .subscribe((successResponse) => {
      
      //show notification
      this.snackbar.open('Student deleted successfully',undefined
      ,{ duration:2000 });

      // delay for 2 seconds 
      setTimeout(() => {
        this.router.navigateByUrl("students");
      },2000);

    },
    (error) => {
      console.log(error);
    }
    )
  }

  onAdd():void{
    this.studentService.addStudent(this.student)
    .subscribe(
      (successresponse)=> {
        this.snackbar.open('Student added successfully',undefined
      ,{ duration:2000 });

      setTimeout(() => {
        this.router.navigateByUrl(`students/${successresponse.id}`)
      }, 2000);


      },
      (error) => {
        console.log(error);
      }
    );
  }

}
