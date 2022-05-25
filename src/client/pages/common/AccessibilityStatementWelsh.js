import React from 'react';
import {
  GridCol,
  GridRow,
  Header,
  ListItem,
  Main,
  UnorderedList,
  Table
} from 'govuk-react';
import PageTitle from '../../components/PageTitle';
import LinkTargetBlank from '../../components/elements/LinkTargetBlank';

export const AccessibilityStatementWelsh = () => (
  <Main>
    <PageTitle title='Hygyrchedd - GOV.UK' />
    <GridRow>
      <GridCol>
        <Header level="1">Datganiad hygyrchedd ar gyfer y gwasanaeth Allforio Pysgod</Header>
        <p>Mae’r gwasanaeth hwn yn rhan o wefan ehangach <LinkTargetBlank href="https://www.gov.uk/cymraeg" ariaLabel="Opens link for GOV.UK" text="GOV.UK"/>. Mae <LinkTargetBlank href="https://www.gov.uk/help/accessibility-statement" ariaLabel="Agor dolen i ddatganiad hygyrchedd prif safle gov.uk" text="datganiad hygyrchedd ar wahân ar gyfer prif wefan GOV.UK."/>
        </p>
        <p>
          Dim ond gwybodaeth am y gwasanaeth Allforio Pysgod sydd ar gael ar y dudalen hon, sydd ar gael yn: <LinkTargetBlank href="/" ariaLabel="Agor dolen i wybodaeth am y gwasanaeth allforio pysgod" text="https://manage-fish-exports.service.gov.uk/" />
        </p>
        <br />
        <Header level="2" size="MEDIUM">Defnyddio’r gwasanaeth hwn</Header>
        <p>Mae’r gwasanaeth hwn yn cael ei redeg gan y Sefydliad Rheoli Morol. Rydyn ni eisiau i gymaint o bobl ag sy’n bosib allu defnyddio'r gwasanaeth hwn. Er enghraifft, mae hynny’n golygu y dylech chi allu:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>newid lliwiau, lefelau cyferbyniad a ffontiau</ListItem>
          <ListItem>chwyddo i mewn hyd at 300% a bod y testun i gyd yn dal i ffitio ar y sgrin</ListItem>
          <ListItem>mynd o ddechrau'r gwasanaeth i'r diwedd gan ddefnyddio bysellfwrdd yn unig</ListItem>
          <ListItem>mynd o ddechrau’r gwasanaeth i’r diwedd gan ddefnyddio meddalwedd adnabod llais</ListItem>
          <ListItem>gwrando ar y gwasanaeth gan ddefnyddio darllenydd sgrin (gan gynnwys y fersiynau mwyaf diweddar o JAWS, NVDA a VoiceOver)</ListItem>
        </UnorderedList>
        <br/>
        <p>Rydyn ni hefyd wedi gwneud testun y gwasanaeth mor syml i’w ddeall ag sy’n bosib.</p>
        <p>Mae <LinkTargetBlank href="https://mcmw.abilitynet.org.uk/" ariaLabel="Agor dolen am ddefnyddio eich dyfais os oes gennych anabledd" text="AbilityNet" /> yn cynnwys cyngor ar wneud eich dyfais yn haws ei defnyddio os oes gennych chi anabledd.</p>
        <Header level="2" size="MEDIUM">Pa mor hygyrch yw’r gwasanaeth hwn</Header>
        <p>Rydyn ni’n ymwybodol nad yw rhannau o'r wefan hon yn gwbl hygyrch.</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>Mae problemau cydnawsedd gyda rhywfaint o dechnoleg gynorthwyol</ListItem>
          <ListItem>Mae rhywfaint o’r llywio’n anghyson neu nid yw wedi’i gysylltu’n glir â’i gynnwys</ListItem>
          <ListItem>Mae problemau wrth newid maint testun ar dudalennau penodol</ListItem>
          <ListItem>Mae enwau hygyrch ar goll o rai botymau</ListItem>
          <ListItem>Mae angen egluro rhai negeseuon gwall</ListItem>
          <ListItem>Mae strwythur pennawd anghywir ar rai tudalennau</ListItem>
          <ListItem>Mae teitl tudalen anghywir wedi'i roi ar waith ar y dudalen Ychwanegu Tystysgrifau Dalfa</ListItem>
          <ListItem>Mae modd tynnu labeli o'u cynnwys ar y dudalen Ychwanegu Tystysgrifau Dalfa</ListItem>
        </UnorderedList>
        <br/>
        <Header level="2" size="MEDIUM">Gwybodaeth gyswllt ac adborth</Header>
        <p>Os ydych chi’n cael trafferth defnyddio’r gwasanaeth hwn, cysylltwch â ni drwy:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>ffonio <a href="tel:0330 159 1989 ">0330 159 1989</a></ListItem>
        </UnorderedList>
        <br />
        <p>Fel rhan o ddarparu’r gwasanaeth hwn, efallai bydd angen i ni anfon negeseuon neu ddogfennau atoch. Byddwn yn gofyn i chi sut rydych chi am i ni anfon negeseuon neu ddogfennau atoch chi, ond cysylltwch â ni os byddwch chi eu hangen mewn fformat gwahanol. Er enghraifft, print bras, recordiad sain neu braille.</p>
        <Header level="2" size="MEDIUM">Rhoi gwybod am broblemau hygyrchedd yn ymwneud â'r gwasanaeth hwn</Header>
        <p>Rydyn ni bob amser yn awyddus i wella hygyrchedd y gwasanaeth hwn. Os ydych chi’n dod ar draws unrhyw broblemau sydd heb eu nodi ar y dudalen hon, neu os ydych chi’n credu nad ydym yn bodloni gofynion hygyrchedd, cysylltwch â: Dom Horsfall (<a href="mailto:dominic.Horsfall@marinemanagement.org.uk">dominic.Horsfall@marinemanagement.org.uk</a>)</p>
        <br />
        <Header level="2" size="MEDIUM">Gweithdrefn gorfodi</Header>
        <p>Y Comisiwn Cydraddoldeb a Hawliau Dynol (EHRC) sy’n gyfrifol am weithredu Rheoliadau Hygyrchedd Cyrff Sector Cyhoeddus (Gwefannau ac Apiau Symudol) (Rhif 2) 2018 (y ‘rheoliadau hygyrchedd’). Os nad ydych chi’n fodlon â sut rydyn ni’n ymateb i’ch cwyn, &nbsp; <LinkTargetBlank href="https://www.equalityadvisoryservice.com/" ariaLabel="Agor dolen i wybodaeth am y gwasanaeth cynghori am gydraddoldeb" text="cysylltwch â’r Gwasanaeth Cynghori a Chefnogi Cydraddoldeb (EASS)." />
        </p>
        <br />

        <Header level="2" size="MEDIUM">Cysylltu â ni dros y ffôn neu ymweld â ni</Header>
        <p>Rydyn ni’n darparu gwasanaeth cyfnewid testun i bobl sy’n fyddar, sydd â nam ar y clyw, neu sydd â nam ar y lleferydd.</p>
        <p>Rydym wedi gosod dolenni sain yn ein swyddfeydd, neu os byddwch chi’n cysylltu â ni ymlaen llaw gallwn drefnu dehonglydd Iaith Arwyddion Prydain i’ch helpu i gwblhau’r gwasanaeth yn bersonol.</p>
        <p>Dysgwch sut mae cysylltu â ni: &nbsp; <LinkTargetBlank href="https://www.gov.uk/contact-local-marine-management-organisation" ariaLabel="Agor dolen i gysylltu â’ch swyddfa Sefydliad Rheoli Morol leol" text="Cysylltu â’ch swyddfa Sefydliad Rheoli Morol leol" />
        </p>


        <br />
        <Header level="2" size="MEDIUM">Gwybodaeth dechnegol am hygyrchedd y gwasanaeth hwn</Header>
        <p>Mae’r Sefydliad Rheoli Morol wedi ymrwymo i wneud y gwasanaeth hwn yn hygyrch, yn unol â Rheoliadau Hygyrchedd Cyrff Sector Cyhoeddus (Gwefannau ac Apiau Symudol) (Rhif 2) 2018.</p>

        <br />
        <Header level="3" size="MEDIUM">Statws Cydymffurfio</Header>
        <p>Mae’r wefan hon yn cydymffurfio'n rhannol â <LinkTargetBlank href="https://www.w3.org/TR/WCAG21/" ariaLabel="Agor dolen i Ganllawiau Hygyrchedd Cynnwys Gwe" text="Chanllawiau Hygyrchedd Cynnwys Gwe fersiwn 2.1 safon AA" />, oherwydd y diffyg cydymffurfio a restrir isod.</p>
        <br />

        <Header level="2" size="MEDIUM">Cynnwys nad yw’n hygyrch</Header>
        <p>Mae’r cynnwys sy’n cael ei restru isod yn anhygyrch am y rhesymau canlynol:</p>

        <br />
        <Header level="3" size="MEDIUM">Diffyg cydymffurfiad â rheoliadau hygyrchedd</Header>
        <p>Mae’r gwasanaeth wedi nodi’r problemau canlynol:</p>
        <Table
         head={(
          <Table.Row>
            <Table.CellHeader>Cyfeirnod</Table.CellHeader>
            <Table.CellHeader>Problem</Table.CellHeader>
            <Table.CellHeader>Lleoliad</Table.CellHeader>
            <Table.CellHeader>Cyf WCAG.</Table.CellHeader>
          </Table.Row>
         )}
         body={
          <>
            <Table.Row>
             <Table.Cell><strong>AA1/A-05a</strong></Table.Cell>
             <Table.Cell><strong>{'Dydy llywio o fis i fis ddim yn gysylltiedig yn weledol nac yn semantig â\'r data \'Cwblhawyd\' uwchben.'}</strong></Table.Cell>
             <Table.Cell>CC,PS,SD - Dangosfwrdd allforiwr</Table.Cell>
             <Table.Cell>1.3.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-05b</strong></Table.Cell>
             <Table.Cell><strong>{'Nid yw’r dolenni \'<<\' a \'>>\' i fisoedd blaenorol/yn y dyfodol wedi’u hegluro neu eu cyflwyno’n semantig mewn ffordd hygyrch.'}</strong></Table.Cell>
             <Table.Cell>CC,PS,SD - Dangosfwrdd allforiwr</Table.Cell>
             <Table.Cell>1.3.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-23</strong></Table.Cell>
             <Table.Cell><strong>Strwythur pennawd anghywir</strong></Table.Cell>
             <Table.Cell>CC,PS,SD - Dangosfwrdd allforiwr</Table.Cell>
             <Table.Cell>1.3.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-07</strong></Table.Cell>
             <Table.Cell><strong>{'Mae modd newid maint y testun ond mae\'r ffordd y mae\'r ffurflen yn cael ei thrin yn golygu nad yw lled y maes yn gallu delio\'n ddigonol â\'r testun mewn maint gwahanol. Felly, mae rhywfaint o’r cynnwys yn cael ei guddio.'}</strong></Table.Cell>
             <Table.Cell>CC - Ychwanegu glaniadau</Table.Cell>
             <Table.Cell>1.4.4</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-08</strong></Table.Cell>
             <Table.Cell><strong>Nid yw cynllun y ffurflen yn ail-lifo wrth newid maint y testun, felly mae rhywfaint o gynnwys yn cael ei guddio. Yn yr un modd, ar sgrin lai ni fydd rhannau o’r ffurflen i’w gweld ar y sgrin.</strong></Table.Cell>
             <Table.Cell>CC - Ychwanegu glaniadau</Table.Cell>
             <Table.Cell>1.4.10</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-09</strong></Table.Cell>
             <Table.Cell><strong>Problemau gyda’r dewiswr dyddiadau.</strong></Table.Cell>
             <Table.Cell>CC,PS,SD</Table.Cell>
             <Table.Cell>2.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-10</strong></Table.Cell>
             <Table.Cell><strong>Problemau awto-deipio Typeahead – ‘Ychwanegu glaniadau ar gyfer pob cynnyrch’.</strong></Table.Cell>
             <Table.Cell>CC,PS,SD</Table.Cell>
             <Table.Cell>2.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-29</strong></Table.Cell>
             <Table.Cell><strong>Problemau teitl tudalen gydag ychwanegu glaniadau - elfen teitl anghywir</strong></Table.Cell>
             <Table.Cell>CC - Ychwanegu glaniadau</Table.Cell>
             <Table.Cell>2.4.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-17</strong></Table.Cell>
             <Table.Cell><strong>Mae enwau hygyrch ar goll o'r botymau 'Golygu' a 'Tynnu'.</strong></Table.Cell>
             <Table.Cell>CC - Ychwanegu glaniadau</Table.Cell>
             <Table.Cell>2.5.3</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-30</strong></Table.Cell>
             <Table.Cell><strong>Materion llywio - dewislen prif lywio anghyson</strong></Table.Cell>
             <Table.Cell>CC,PS,SD - Dangosfwrdd allforiwr</Table.Cell>
             <Table.Cell>3.2.3</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-18</strong></Table.Cell>
             <Table.Cell><strong>Enghreifftiau o negeseuon gwall generig.</strong></Table.Cell>
             <Table.Cell>CC - Ychwanegu glaniadau</Table.Cell>
             <Table.Cell>3.3.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-33</strong></Table.Cell>
             <Table.Cell><strong>Mae labeli’r ffurflen glaniadau’n diflannu o'r golwg wrth ychwanegu mwy nag un glaniad.</strong></Table.Cell>
             <Table.Cell>CC - Ychwanegu glaniadau</Table.Cell>
             <Table.Cell>3.3.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-34</strong></Table.Cell>
             <Table.Cell><strong>Mae’r broses ddilysu’n benodol o ran “manylion cludo”, ond nid yw’n rhoi gwybod i’r defnyddiwr beth mae angen iddo ei wneud i gywiro ei gamgymeriadau.</strong></Table.Cell>
             <Table.Cell>CC,SD - Ychwanegu manylion cludo</Table.Cell>
             <Table.Cell>3.3.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-01</strong></Table.Cell>
             <Table.Cell><strong>Nid yw’r rhestrau dewis ar y gwymplen ar gael wrth ddefnyddio Dragon Naturallyspeaking.</strong></Table.Cell>
             <Table.Cell>CC - Ychwanegu cynnyrch</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-02</strong></Table.Cell>
             <Table.Cell><strong>Does dim modd dewis dyddiad wrth ddefnyddio Dragon Naturallying.</strong></Table.Cell>
             <Table.Cell>CC - Ychwanegu glaniadau</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-03</strong></Table.Cell>
             <Table.Cell><strong>Nid yw’r rhestrau dewis ar y gwymplen ar gael wrth ddefnyddio Dragon Naturallyspeaking.</strong></Table.Cell>
             <Table.Cell>CC - Ychwanegu glaniadau</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-20</strong></Table.Cell>
             <Table.Cell><strong>Problemau cydnawsedd gyda Dragon Naturally Speaking.</strong></Table.Cell>
             <Table.Cell>CC,PS,SD</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-21</strong></Table.Cell>
             <Table.Cell><strong>Problemau llywio - rolau ARIA coll</strong></Table.Cell>
             <Table.Cell>CC,PS,SD</Table.Cell>
             <Table.Cell>4.1.2</Table.Cell>
           </Table.Row>
           <Table.Row>
             <Table.Cell><strong>AA1/A-35</strong></Table.Cell>
             <Table.Cell><strong>Mae mwy nag un math o fformat yn cael ei ddefnyddio gan y dewiswyr dyddiadau. Does dim modd defnyddio’r bysellfwrdd gyda’r fersiwn hwn.</strong></Table.Cell>
             <Table.Cell>SD - Ychwanegu cynnyrch</Table.Cell>
             <Table.Cell>4.1.1</Table.Cell>
           </Table.Row>
          </>
         }
        />
        <br />
        <p>CC - Tystysgrifau Dalfa, PS - Prosesu Datganiadau, SD - Dogfennau Storio</p>
        <p>Bwriadwn ddatrys y problemau hyn cyn gynted ag y bo modd.</p>

        <br />
        <Header level="3" size="MEDIUM">Baich anghymesur</Header>
        <p>Ar gyfer tystysgrifau dalfa:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>dim ond ar ffurf PDF y mae'r ffurflenni ar gyfer glaniadau uniongyrchol ar gael</ListItem>
        </UnorderedList>
        <br/>
        <p>Mae’r ffurflenni PDF hyn wedi pasio safonau WCAG AA. Fodd bynnag, rydym yn bwriadu eu disodli â ffurflenni HTML yn y tymor hir.</p>

        <Header level="2" size="MEDIUM">Beth rydyn ni’n ei wneud i wella hygyrchedd</Header>
        <p>Er mwyn gwella’n barhaus, nod y gwasanaeth yw:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem>canfod a datrys problemau hygyrchedd sydd ddim yn cydymffurfio â WCAG 2.1 AA (blaenoriaeth 1)</ListItem>
          <ListItem>gwneud gwaith ymchwil parhaus i wneud yn siŵr eich bod yn gallu cwblhau’r gwasanaeth y tro cyntaf, a gwneud gwelliannau lle bo angen (blaenoriaeth 2)</ListItem>
          <ListItem>parhau i ymchwilio a phrofi’r gwasanaeth fel ei fod yn cyflawni eich anghenion (blaenoriaeth 3)</ListItem>
        </UnorderedList>
        <br />
        <Header level="2" size="MEDIUM">Paratoi’r datganiad hygyrchedd hwn</Header>
        <p>Paratowyd y datganiad hwn ar 3 Mehefin 2021. Cafodd ei adolygu ddiwethaf ar 3 Mehefin 2021.</p>
        <p>Cafodd y gwasanaeth hwn ei brofi ddiwethaf ar 21 Medi 2020. Cynhaliwyd y prawf gan dîm hygyrchedd Gwasanaethau Digidol, Data a Thechnoleg Defra.</p>
        <br />
      </GridCol>
    </GridRow>
  </Main>
);