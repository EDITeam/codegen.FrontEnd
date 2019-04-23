import { XmlJson } from './../../xml-json';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  masterTable: any[] = [];
  childTable: any[] = [];
  fileName: any;

  constructor() { }

  ngOnInit() {
  }

  /**
   * typescript数据类型：any,enum,array,string,number,boolean
   */
  readXML() {
    try {
      let that: this = this;
      if (that.fileName === undefined || that.fileName === '') {
        alert('请输入数据结构xml文件名称');
        return;
      }
      that.masterTable = [];
      that.childTable = [];
      let file = './assets/DS/' + that.fileName + '.xml';
      let xhttp = new XMLHttpRequest();
      let times = 0;
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          that.myFunction(this);
        } else if (this.readyState === 4 && this.status !== 200) {
          alert('未找到该xml文件，请检查名称后重试。');
        }
      };
      xhttp.open('GET', file, true);
      xhttp.send();
    } catch (error) {
      alert(error);
    }
  }

  myFunction(xml: XMLHttpRequest) {
    try {
      let that: this = this;
      let xmlDoc = xml.response.toString();
      let parser = new DOMParser();
      let xmlObject = parser.parseFromString(xmlDoc, 'text/xml');
      let currentIndex = 0;

      // 读取主表信息并绑定
      for (let i = 2; i < xmlObject.all.length; i++) {
        if (xmlObject.all[i].localName === 'Field') {
          let masterField: string;
          if (xmlObject.all[i].attributes[2].nodeValue === 'db_Numeric' || xmlObject.all[i].attributes[2].nodeValue === 'db_Float') {
            masterField = xmlObject.all[i].attributes[0].nodeValue + ':number;';
          } else if (xmlObject.all[i].attributes[2].nodeValue === 'db_Alpha' || xmlObject.all[i].attributes[2].nodeValue === 'db_Memo') {
            masterField = xmlObject.all[i].attributes[0].nodeValue + ':string;';
          } else if (xmlObject.all[i].attributes[2].nodeValue === 'db_Date') {
            masterField = xmlObject.all[i].attributes[0].nodeValue + ':Date;';
          } else {
            masterField = xmlObject.all[i].attributes[0].nodeValue + ':any;';
          }
          that.masterTable.push(masterField);
        } else {
          currentIndex = i;
          break;
        }
      }
      // 读取子表信息并绑定
      let tempChildTable = [];
      for (let i = currentIndex + 1; i < xmlObject.all.length; i++) {
        if (xmlObject.all[i].localName === 'Field') {
          let childField: string;
          if (xmlObject.all[i].attributes[2].nodeValue === 'db_Numeric' || xmlObject.all[i].attributes[2].nodeValue === 'db_Float') {
            childField = xmlObject.all[i].attributes[0].nodeValue + ':number;';
          } else if (xmlObject.all[i].attributes[2].nodeValue === 'db_Alpha' || xmlObject.all[i].attributes[2].nodeValue === 'db_Memo') {
            childField = xmlObject.all[i].attributes[0].nodeValue + ':string;';
          } else if (xmlObject.all[i].attributes[2].nodeValue === 'db_Date') {
            childField = xmlObject.all[i].attributes[0].nodeValue + ':Date;';
          } else {
            childField = xmlObject.all[i].attributes[0].nodeValue + ':any;';
          }
          that.childTable.push(childField);
        } else {
          break;
        }
      }
    } catch (error) {
      alert(error);
    }
  }
}
