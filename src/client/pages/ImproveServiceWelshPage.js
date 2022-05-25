import React from 'react';
import {
  Main,
  BackLink,
  GridRow,
  GridCol,
  Header,
  UnorderedList,
  ListItem,
} from 'govuk-react';
import PageTitle from '../components/PageTitle';

const ImproveServiceWelshPage = ({
  feedbackUrl,
  listFont,
  backRoute,
  goBack,
  title,
}) => (
  <Main>
    <PageTitle title={`Cynllun gwella gwasanaeth - ${title}`} />
    <BackLink
      onClick={(e) => {
        e.preventDefault();
        goBack();
      }}
      href={backRoute}
    >
      Yn ôl
    </BackLink>
    <GridRow>
      <GridCol>
        <Header level="1">Sut rydyn ni’n gwella’r gwasanaeth</Header>
      </GridCol>
    </GridRow>
    <GridRow>
      <GridCol>
        <p>
          Mae’r <strong>Gwasanaeth Allforio Pysgod</strong> yn helpu busnesau
          sy’n gweithredu yn y DU i gynhyrchu dogfennau sy’n golygu bod modd
          allforio pysgod i’r UE ac i rai gwledydd eraill.
        </p>
        <p>Mae’r gwasanaeth yn:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem style={listFont}>
            defnyddio eich gwybodaeth mewn ffordd ddiogel
          </ListItem>
          <ListItem style={listFont}>
            gweithio tuag at safon hygyrchedd WCAG 2.1 AA
          </ListItem>
          <ListItem style={listFont}>
            defnyddio technoleg sy’n ei alluogi i wella dros amser
          </ListItem>
          <ListItem style={listFont}>
            Anelu at gyrraedd{' '}
            <a
              href="https://www.gov.uk/service-manual/service-standard"
              rel="noopener noreferrer"
              target="_blank"
              alt="Opens service manual"
            >
              Safon Gwasanaeth Digidol y Llywodraeth (yn agor mewn tab newydd)
            </a>
            .
          </ListItem>
        </UnorderedList>
        <br />
        <p>Er mwyn gwella’n barhaus, nod y gwasanaeth yw:</p>
        <UnorderedList className="ul" listStyleType="disc">
          <ListItem style={listFont}>
            canfod a datrys problemau hygyrchedd sydd ddim yn cydymffurfio â
            WCAG 2.1 AA (blaenoriaeth 1)
          </ListItem>
          <ListItem style={listFont}>
            gwneud gwaith ymchwil parhaus i wneud yn siŵr eich bod yn gallu
            cwblhau’r gwasanaeth y tro cyntaf, a gwneud gwelliannau lle bo angen
            (blaenoriaeth 2)
          </ListItem>
          <ListItem style={listFont}>
            parhau i ymchwilio a phrofi’r gwasanaeth fel ei fod yn cyflawni eich
            anghenion (blaenoriaeth 3)
          </ListItem>
        </UnorderedList>
        <br />
        <p>
          Bydd eich{' '}
          <a
            href={feedbackUrl}
            rel="noopener noreferrer"
            target="_blank"
            alt="Opens feedback form"
          >
            adborth (yn agor mewn tab newydd)
          </a>{' '}
          yn ein helpu i wella’r gwasanaeth hwn.
        </p>
      </GridCol>
    </GridRow>
  </Main>
);

export default ImproveServiceWelshPage;
