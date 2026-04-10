'use client'

import {type AdminProduct} from '../../entities/product'
import {
	Button,
	EntityPageHeader,
	Link,
} from '../../shared'
import {DocumentsSection} from './ui/DocumentsSection'
import {MainSection} from './ui/MainSection'
import {SpecsSection} from './ui/SpecsSection'
import {TagsSection} from './ui/TagsSection'
import {UploadPhotoSection} from './ui/UploadPhotoSection'
import {type ProductFormMode} from './viewmodel'
import {useAdminProductFormViewmodel} from './viewmodel/provider'
import {AdminProductFormProvider} from './viewmodel/viewmodel'

function AdminProductFormContent() {
	const {
		page,
		main,
		specs,
		tags,
		media,
		documents,
	} = useAdminProductFormViewmodel()

	return (
		<div className="space-y-6">
			<EntityPageHeader
				title={page.title}
				breadcrumbs={(
					<Link
						href="/admin/products"
						className="text-sm text-muted-foreground underline-offset-4 hover:underline"
					>
						{'Назад к списку товаров'}
					</Link>
				)}
			/>
			<div className="max-w-7xl">
				<form
					className="grid gap-6 xl:grid-cols-3"
					onSubmit={page.onSubmit}
				>
					<MainSection main={main} />
					<SpecsSection specs={specs} />
					<TagsSection tags={tags} />
					<UploadPhotoSection media={media} />
					<DocumentsSection documents={documents} />
					{page.errorText
						? (
							<p
								className="text-sm text-destructive xl:col-span-2"
								role="alert"
							>
								{page.errorText}
							</p>
						)
						: null}
					<div className="flex gap-2 xl:col-span-2">
						<Button
							type="submit"
							state={page.disabled
								? 'loading'
								: 'default'}
						>
							{page.submitLabel}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={page.onCancel}
						>
							{'Отмена'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

type AdminProductFormProps = Readonly<{
	mode?: ProductFormMode,
	productId?: string,
	initialProduct?: AdminProduct,
}>

function AdminProductForm({
	mode = 'create',
	productId,
	initialProduct,
}: AdminProductFormProps) {
	return (
		<AdminProductFormProvider
			mode={mode}
			productId={productId}
			initialProduct={initialProduct}
		>
			<AdminProductFormContent />
		</AdminProductFormProvider>
	)
}

export {
	AdminProductForm,
	type AdminProductFormProps,
}
