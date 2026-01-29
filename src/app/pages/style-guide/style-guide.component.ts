import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {AddTaskComponent} from '../add-task/add-task.component';
import {EditTaskComponent} from '../edit-task/edit-task.component';
import {RecoverPasswordComponent} from '../recover-password/recover-password.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrl: '../../../styles/styles.css',
  imports: [
    ButtonComponent,
    FormInputComponent,
    LoginComponent,
    RegisterComponent,
    AddTaskComponent,
    EditTaskComponent,
    RecoverPasswordComponent,
    TranslateModule
  ],
  standalone: true,
})
export class StyleGuideComponent implements OnInit{
  constructor(private translate: TranslateService) {}
  protected readonly RTCSessionDescription = RTCSessionDescription;
  title: string = '';
  intro: string = '';
  typographyTitle: string = '';
  firstTypography: string = '';
  firstTypographyDescription: string = '';
  secondTypography: string = ''
  secondTypographyDescription: string = '';
  alternativeTypography: string = '';
  alternativeTypographyDescription: string = '';
  typographySizes: string = '';
  typographySizesDescription: string = '';
  typographyDecorations: string = '';
  typographyDecorationsDescription: string = '';
  colorsTitle: string = '';
  colorsDescription1: string = '';
  colorsDescription2: string = '';
  primaryColor: string = '';
  primaryColorDescription: string = '';
  secondaryColor: string = '';
  secondaryColorDescription: string = '';
  neutralColor: string = '';
  neutralColorDescription: string = ''
  othersColors: string = '';
  othersColorsDescription: string = '';
  usedColors: string = '';
  iconographyTitle: string = '';
  iconographyDescription1: string = '';
  iconographyDescription2: string = '';
  iconographyDescription3: string = '';
  spacingTitle: string = '';
  spacingText1: string = '';
  spacingText2: string = '';
  componentsTitle: string = '';
  componentItem1: string = '';
  componentItem2: string = '';
  componentItem3: string = '';
  componentItem4: string = '';
  formsTitle: string = '';
  formsText1: string = '';
  formsText2: string = '';
  formsText3: string = '';
  utilitiesTitle: string = '';
  utilitiesText1: string = '';
  utilitiesText2: string = '';
  utilitiesText3: string = '';
  darkmodeTitle: string = '';
  darkmodeText1: string = '';
  darkmodeText2: string = '';
  darkmodeText3: string = '';
  darkmodeText4: string = '';
  a11yTitle: string = '';
  a11yItem1Part1: string = '';
  a11yItem1Part2: string = '';
  a11yItem2: string = '';
  contributingTitle: string = '';
  contributingText1: string = '';
  contributingLi1: string = '';
  contributingLi2Part1: string = '';
  contributingLi2Part2: string = '';
  contributingLi3: string = '';
  lastUpdatePart1: string = '';
  lastUpdatePart2: string = '';


  ngOnInit() {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  private setTranslations() {
    this.title = this.translate.instant('PAGES.STYLESGUIDE.TITLE');
    this.intro = this.translate.instant('PAGES.STYLESGUIDE.INTRO');
    this.typographyTitle = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.TITLE');
    this.firstTypography = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.FIRSTTYPOGRAPHY');
    this.firstTypographyDescription = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.FIRSTTYPOGRAPHYDESCRIPTION');
    this.secondTypography = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.SECONDTYPOGRAPHY');
    this.secondTypographyDescription = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.SECONDTYPOGRAPHYDESCRIPTION');
    this.alternativeTypography = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.ALTERNATIVETYPOGRAPHY');
    this.alternativeTypographyDescription = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.ALTERNATIVETYPOGRAPHYDESCRIPTION');
    this.typographySizes = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.TYPOGRAPHSIZES');
    this.typographySizesDescription = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.TYPOGRAPHSIZESDESCRIPTION');
    this.typographyDecorations = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.TYPOGRAPHYDECORATIONS');
    this.typographyDecorationsDescription = this.translate.instant('PAGES.STYLESGUIDE.TYPOGRAPHY.TYPOGRAPHYDECORATIONSDESCRIPTION');
    this.colorsTitle = this.translate.instant('PAGES.STYLESGUIDE.COLORS.TITLE');
    this.colorsDescription1 = this.translate.instant('PAGES.STYLESGUIDE.COLORS.DESCRIPTION1');
    this.colorsDescription2 = this.translate.instant('PAGES.STYLESGUIDE.COLORS.DESCRIPTION2');
    this.primaryColor = this.translate.instant('PAGES.STYLESGUIDE.COLORS.PRIMARYCOLOR');
    this.primaryColorDescription = this.translate.instant('PAGES.STYLESGUIDE.COLORS.PRIMARYCOLORDESCRIPTION');
    this.secondaryColor = this.translate.instant('PAGES.STYLESGUIDE.COLORS.SECONDARYCOLOR');
    this.secondaryColorDescription = this.translate.instant('PAGES.STYLESGUIDE.COLORS.SECONDARYCOLORDESCRIPTION');
    this.neutralColor = this.translate.instant('PAGES.STYLESGUIDE.COLORS.NEUTRALCOLOR');
    this.neutralColorDescription = this.translate.instant('PAGES.STYLESGUIDE.COLORS.NEUTRALCOLORDESCRIPTION');
    this.othersColors = this.translate.instant('PAGES.STYLESGUIDE.COLORS.OTHERSCOLORS');
    this.othersColorsDescription = this.translate.instant('PAGES.STYLESGUIDE.COLORS.OTHERSCOLORSDESCRIPTION');
    this.usedColors = this.translate.instant('PAGES.STYLESGUIDE.COLORS.USEDCOLORS');
    this.iconographyTitle = this.translate.instant('PAGES.STYLESGUIDE.ICONOGRAPHY.TITLE');
    this.iconographyDescription1 = this.translate.instant('PAGES.STYLESGUIDE.ICONOGRAPHY.DESCRIPTION1');
    this.iconographyDescription2 = this.translate.instant('PAGES.STYLESGUIDE.ICONOGRAPHY.DESCRIPTION2');
    this.iconographyDescription3 = this.translate.instant('PAGES.STYLESGUIDE.ICONOGRAPHY.DESCRIPTION3');

    // Nuevas secciones
    this.spacingTitle = this.translate.instant('PAGES.STYLESGUIDE.SPACING.TITLE');
    this.spacingText1 = this.translate.instant('PAGES.STYLESGUIDE.SPACING.TEXT1');
    this.spacingText2 = this.translate.instant('PAGES.STYLESGUIDE.SPACING.TEXT2');

    this.componentsTitle = this.translate.instant('PAGES.STYLESGUIDE.COMPONENTS.TITLE');
    this.componentItem1 = this.translate.instant('PAGES.STYLESGUIDE.COMPONENTS.ITEM1');
    this.componentItem2 = this.translate.instant('PAGES.STYLESGUIDE.COMPONENTS.ITEM2');
    this.componentItem3 = this.translate.instant('PAGES.STYLESGUIDE.COMPONENTS.ITEM3');
    this.componentItem4 = this.translate.instant('PAGES.STYLESGUIDE.COMPONENTS.ITEM4');

    this.formsTitle = this.translate.instant('PAGES.STYLESGUIDE.FORMS.TITLE');
    this.formsText1 = this.translate.instant('PAGES.STYLESGUIDE.FORMS.TEXT1');
    this.formsText2 = this.translate.instant('PAGES.STYLESGUIDE.FORMS.TEXT2');
    this.formsText3 = this.translate.instant('PAGES.STYLESGUIDE.FORMS.TEXT3');

    this.utilitiesTitle = this.translate.instant('PAGES.STYLESGUIDE.UTILITIES.TITLE');
    this.utilitiesText1 = this.translate.instant('PAGES.STYLESGUIDE.UTILITIES.TEXT1');
    this.utilitiesText2 = this.translate.instant('PAGES.STYLESGUIDE.UTILITIES.TEXT2');
    this.utilitiesText3 = this.translate.instant('PAGES.STYLESGUIDE.UTILITIES.TEXT3');

    this.darkmodeTitle = this.translate.instant('PAGES.STYLESGUIDE.DARKMODE.TITLE');
    this.darkmodeText1 = this.translate.instant('PAGES.STYLESGUIDE.DARKMODE.TEXT1');
    this.darkmodeText2 = this.translate.instant('PAGES.STYLESGUIDE.DARKMODE.TEXT2');
    this.darkmodeText3 = this.translate.instant('PAGES.STYLESGUIDE.DARKMODE.TEXT3');
    this.darkmodeText4 = this.translate.instant('PAGES.STYLESGUIDE.DARKMODE.TEXT4');

    this.a11yTitle = this.translate.instant('PAGES.STYLESGUIDE.A11Y.TITLE');
    this.a11yItem1Part1 = this.translate.instant('PAGES.STYLESGUIDE.A11Y.ITEM1_PART1');
    this.a11yItem1Part2 = this.translate.instant('PAGES.STYLESGUIDE.A11Y.ITEM1_PART2');
    this.a11yItem2 = this.translate.instant('PAGES.STYLESGUIDE.A11Y.ITEM2');

    this.contributingTitle = this.translate.instant('PAGES.STYLESGUIDE.CONTRIBUTING.TITLE');
    this.contributingText1 = this.translate.instant('PAGES.STYLESGUIDE.CONTRIBUTING.TEXT1');
    this.contributingLi1 = this.translate.instant('PAGES.STYLESGUIDE.CONTRIBUTING.LI1');
    this.contributingLi2Part1 = this.translate.instant('PAGES.STYLESGUIDE.CONTRIBUTING.LI2_PART1');
    this.contributingLi2Part2 = this.translate.instant('PAGES.STYLESGUIDE.CONTRIBUTING.LI2_PART2');
    this.contributingLi3 = this.translate.instant('PAGES.STYLESGUIDE.CONTRIBUTING.LI3');

    this.lastUpdatePart1 = this.translate.instant('PAGES.STYLESGUIDE.LASTUPDATE.PART1');
    this.lastUpdatePart2 = this.translate.instant('PAGES.STYLESGUIDE.LASTUPDATE.PART2');
  }
}
