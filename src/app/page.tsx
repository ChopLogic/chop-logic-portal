import { Button, Header, Icon, IconName } from "@/lib/chop-logic-components";

export default function Home() {
  return (
    <>
      <Header as="h1" icon={IconName.Home}>
        Chop Logic Portal
      </Header>
      <p>
        This is the home page of the Chop Logic portal — a place for articles
        and books.
      </p>
      <Button text="Click me!" />
      <Icon name={IconName.Info} />
    </>
  );
}
