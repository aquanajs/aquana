export interface HtmlElement {
    tag: string;
    props: Record<string, string>;
    textContent: string;
    children: HtmlElement[];
}