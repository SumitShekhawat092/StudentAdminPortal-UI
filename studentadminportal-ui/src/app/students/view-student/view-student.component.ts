import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/Services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';

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
  genderList: Gender[] = [];
  constructor(private readonly studentService: StudentService
    ,private readonly route: ActivatedRoute
    ,private readonly genderService: GenderService
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if(this.studentId){
          this.studentService.getStudent(this.studentId)
          .subscribe(
            (successResponse) => {
              this.student = successResponse;
            }
          );
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
        console.log(successResponse);
        //show a notification
      },
      (error) => {
        //log it
        console.log(error);
      })
  }

}
