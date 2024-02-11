import {
	Component,
	Index,
	Show,
	createEffect,
	onCleanup,
	createSignal,
} from "solid-js";
import { usePageState } from "~/data/page-state";

export const TableOfContents: Component = () => {
	const { pageSections } = usePageState();
	const [currentSection, setCurrentSection] = createSignal("");

	const onScroll = () => {
		const headings = document.querySelectorAll("h2, h3");
		let currentSection = "";
		headings.forEach((heading) => {
			if (heading.getBoundingClientRect().top < 300) {
				currentSection = heading.id;
			}
		});
		setCurrentSection(currentSection);
	};

	createEffect(() => {
		window.addEventListener("scroll", onScroll);
		onCleanup(() => {
			window.removeEventListener("scroll", onScroll);
		});
	});

	return (
		<aside aria-label="table of contents" class="w-full">
			<span class="font-display text-base font-medium text-slate-900 dark:text-white">
				On this page
			</span>
			<ol
				role="list"
				class="text-sm list-none mt-2 p-0 flex flex-col active:font-bold hover:text-slate-700 dark:hover:text-sky-200 font-bold active:text-sky-600"
			>
				<li class="pl-0 mt-0">
					<span>
						<a
							href={`#_top`}
							classList={{
								"dark:text-sky-200 hover:text-sky-700 dark:hover:text-sky-200":
									currentSection() !== "",
								"text-sky-500 font-bold": currentSection() === "",
							}}
							class="no-underline hover:font-bold hover:text-sky-800 dark:hover:text-sky-300"
						>
							Overview
						</a>
					</span>
				</li>
				<Index each={pageSections.sections}>
					{(section) => (
						<li class="pl-0">
							<span class="mt-2">
								<a
									href={`#${section().id}`}
									classList={{
										"dark:text-slate-300": currentSection() !== section().id,
										"text-sky-400 hover:text-slate-700 dark:hover:text-sky-200 font-bold":
											currentSection() === section().id,
									}}
									class="no-underline hover:font-bold hover:text-slate-700 dark:hover:text-sky-300"
								>
									{section().text}
								</a>
							</span>
							<Show when={section().children.length !== 0}>
								<ol
									role="list"
									class="space-y-2 pl-5 text-slate-500 dark:text-slate-300 list-none"
								>
									<Index each={section().children}>
										{(subSection) => (
											<li>
												<a
													href={`#${subSection().id}`}
													classList={{
														"dark:text-slate-300":
															currentSection() !== subSection().id,
														"text-sky-300":
															currentSection() === subSection().id,
													}}
													class="no-underline hover:text-slate-700 dark:hover:text-slate-300"
												>
													{subSection().text}
												</a>
											</li>
										)}
									</Index>
								</ol>
							</Show>
						</li>
					)}
				</Index>
			</ol>
		</aside>
	);
};
